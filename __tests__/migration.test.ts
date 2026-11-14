import { DatabaseSync } from 'node:sqlite';
import { Repository, schema, type SqlExecutor } from '../src/data/repository';
test('version 1 through 3 migrations preserve existing tasks', async () => {
  const sqlite = new DatabaseSync(':memory:');
  try {
    for (const statement of schema) {
      sqlite.exec(statement);
    }
    sqlite.exec(
      "PRAGMA user_version=1; INSERT INTO tasks(id,title,description,priority,createdAt) VALUES('old','Keep me','',0,'2026-11-14T00:00:00Z')",
    );
    const executor: SqlExecutor = {
      async execute(sql, params = []) {
        const stmt = sqlite.prepare(sql);
        if (/^\s*(SELECT|PRAGMA)/i.test(sql)) {
          return stmt.all(...params) as Record<string, unknown>[];
        }
        stmt.run(...params);
        return [];
      },
    };
    const repo = new Repository({
      ...executor,
      async transaction(work) {
        sqlite.exec('BEGIN');
        try {
          const result = await work(executor);
          sqlite.exec('COMMIT');
          return result;
        } catch (error) {
          sqlite.exec('ROLLBACK');
          throw error;
        }
      },
    });
    await repo.initialize();
    expect((await repo.snapshot()).tasks[0].title).toBe('Keep me');
    expect(sqlite.prepare('PRAGMA user_version').get()?.user_version).toBe(3);
    expect((await repo.snapshot()).focusSessions).toEqual([]);
  } finally {
    sqlite.close();
  }
});
