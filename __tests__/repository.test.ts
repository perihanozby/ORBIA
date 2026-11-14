import { DatabaseSync } from 'node:sqlite';
import {
  Repository,
  type Database,
  type SqlExecutor,
} from '../src/data/repository';
import { localDate } from '../src/domain/productivity';

function fixture() {
  const sqlite = new DatabaseSync(':memory:');
  const executor: SqlExecutor = {
    async execute(sql, params = []) {
      const statement = sqlite.prepare(sql);
      if (/^\s*(SELECT|PRAGMA)/i.test(sql)) {
        return statement.all(...params) as Record<string, unknown>[];
      }
      statement.run(...params);
      return [];
    },
  };
  const db: Database = {
    ...executor,
    async transaction(work) {
      sqlite.exec('BEGIN IMMEDIATE');
      try {
        const result = await work(executor);
        sqlite.exec('COMMIT');
        return result;
      } catch (error) {
        sqlite.exec('ROLLBACK');
        throw error;
      }
    },
  };
  return { repo: new Repository(db), sqlite, db };
}
test('schema initializes idempotently and rejects future versions without resetting data', async () => {
  const { repo, sqlite } = fixture();
  try {
    await repo.initialize();
    await repo.initialize();
    expect((await repo.snapshot()).tasks).toEqual([]);
    sqlite.exec('PRAGMA user_version = 4');
    await expect(repo.initialize()).rejects.toThrow('futureDatabase');
    expect(sqlite.prepare('PRAGMA user_version').get()?.user_version).toBe(4);
  } finally {
    sqlite.close();
  }
});
test('task CRUD, focus slots, completion and date transitions persist in SQLite', async () => {
  const { repo, sqlite } = fixture();
  try {
    await repo.initialize();
    const today = localDate('2026-11-14');
    for (const id of ['a', 'b', 'c', 'd']) {
      await repo.saveTask({
        id,
        title: id,
        description: '',
        priority: 0,
        dueDate: today,
        goalId: null,
      });
    }
    for (const id of ['a', 'b', 'c']) {
      await repo.selectFocus(id, today);
    }
    await repo.completeTask('a', true);
    await expect(repo.selectFocus('d', today)).rejects.toThrow(
      'focusThreeLimit',
    );
    await repo.selectFocus('d', localDate('2026-11-15'));
    await repo.selectFocus('b', today);
    await repo.selectFocus('d', today);
    await repo.deleteTask('a');
    const snapshot = await repo.snapshot();
    expect(snapshot.tasks).toHaveLength(3);
    expect(snapshot.selections.filter(s => s.date === today)).toHaveLength(2);
    await repo.completeTask('c', true);
    await repo.completeTask('c', false);
    expect(
      (await repo.snapshot()).tasks.find(t => t.id === 'c')?.completedAt,
    ).toBeNull();
  } finally {
    sqlite.close();
  }
});
test('goal relationships, occurrence uniqueness and transaction rollback are enforced', async () => {
  const { repo, sqlite, db } = fixture();
  try {
    await repo.initialize();
    await repo.saveGoal('goal', 'Read more', '', ['Chapter one']);
    await repo.saveTask({
      id: 'task',
      title: 'Read',
      description: '',
      priority: 1,
      dueDate: null,
      goalId: 'goal',
    });
    await repo.deleteGoal('goal');
    expect((await repo.snapshot()).tasks[0].goalId).toBeNull();
    expect((await repo.snapshot()).milestones).toHaveLength(0);
    await expect(
      repo.saveTask({
        id: 'bad',
        title: 'Bad',
        description: '',
        priority: 0,
        dueDate: null,
        goalId: 'missing',
      }),
    ).rejects.toThrow();
    await repo.saveHabit('habit', 'Walk', '', [1, 2, 3, 4, 5]);
    const date = localDate('2026-11-14');
    await repo.trackHabit('habit', date, 'complete');
    await repo.trackHabit('habit', date, 'skipped');
    expect((await repo.snapshot()).occurrences).toEqual([
      { habitId: 'habit', date, state: 'skipped' },
    ]);
    await expect(
      db.transaction(async tx => {
        await tx.execute(
          "INSERT INTO preferences(key,value) VALUES('test','value')",
        );
        throw new Error('rollback');
      }),
    ).rejects.toThrow('rollback');
    expect((await repo.snapshot()).preferences).toEqual({});
    await repo.trackHabit('habit', date, null);
    expect((await repo.snapshot()).occurrences).toHaveLength(0);
  } finally {
    sqlite.close();
  }
});
