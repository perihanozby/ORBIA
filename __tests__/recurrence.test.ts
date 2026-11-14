import { testDatabase } from '../test-utils/database';
import { nextOccurrence } from '../src/domain/recurrence';
import { localDate } from '../src/domain/productivity';
import { makeBackup } from '../src/data/backup';
test('recurrence uses calendar dates with month-end clamping and leap-year rules', () => {
  expect(nextOccurrence(localDate('2026-12-31'), 'daily')).toBe('2027-01-01');
  expect(nextOccurrence(localDate('2026-10-29'), 'weekly')).toBe('2026-11-05');
  expect(nextOccurrence(localDate('2024-01-31'), 'monthly')).toBe('2024-02-29');
  expect(nextOccurrence(localDate('2026-01-31'), 'monthly')).toBe('2026-02-28');
});
test('recurring completion is atomic and idempotent, and undo keeps the existing successor', async () => {
  const db = testDatabase();
  try {
    await db.repository.initialize();
    await db.repository.saveTask(
      {
        id: 'daily',
        title: 'Read',
        description: '',
        dueDate: localDate('2026-11-14'),
        priority: 1,
        goalId: null,
        recurrence: 'daily',
      },
      ['Open the book', 'Read a page'],
    );
    let data = await db.repository.snapshot();
    await db.repository.subtask(data.subtasks[0].id, true);
    await db.repository.saveTask({ ...data.tasks[0], title: 'Read calmly' }, [
      'Open the book',
      'Read a page',
      'Reflect',
    ]);
    expect(
      (await db.repository.snapshot()).subtasks.find(
        s => s.title === 'Open the book',
      )?.completed,
    ).toBe(1);
    await db.repository.completeTask('daily', true);
    await db.repository.completeTask('daily', true);
    await db.repository.completeTask('daily', false);
    await db.repository.completeTask('daily', true);
    data = await db.repository.snapshot();
    expect(data.tasks).toHaveLength(2);
    const next = data.tasks.find(task => task.successorOf === 'daily')!;
    expect(next.dueDate).toBe('2026-11-15');
    expect(data.subtasks.filter(s => s.taskId === next.id)).toHaveLength(3);
    expect(
      data.subtasks
        .filter(s => s.taskId === next.id)
        .every(s => s.completed === 0),
    ).toBe(true);
    const backup = makeBackup(data);
    await db.repository.restoreBackup(backup);
    expect(
      (await db.repository.snapshot()).tasks.find(
        task => task.successorOf === 'daily',
      )?.id,
    ).toBe(next.id);
    await db.repository.deleteTask('daily');
    data = await db.repository.snapshot();
    expect(data.tasks).toHaveLength(1);
    expect(data.tasks[0].successorOf).toBeNull();
    expect(data.subtasks).toHaveLength(3);
    await expect(
      db.repository.saveTask({
        id: 'invalid',
        title: 'Repeat',
        description: '',
        dueDate: null,
        priority: 0,
        goalId: null,
        recurrence: 'daily',
      }),
    ).rejects.toThrow('invalidRecurrence');
  } finally {
    db.close();
  }
});
