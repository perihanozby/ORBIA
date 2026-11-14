import { testDatabase } from '../test-utils/database';
import { makeBackup, parseBackup } from '../src/data/backup';
import { FocusClock } from '../src/domain/focus';
test('backup roundtrip restores relationships and rejects invalid data without overwriting', async () => {
  const db = testDatabase();
  try {
    await db.repository.initialize();
    await db.repository.saveGoal('g', 'Learn', '', ['First step']);
    await db.repository.saveTask({
      id: 't',
      title: 'Practice',
      description: '',
      dueDate: null,
      priority: 1,
      goalId: 'g',
    });
    const backup = makeBackup(await db.repository.snapshot());
    const legacy=JSON.parse(backup);legacy.version=1;delete legacy.data.focusSessions;delete legacy.data.subtasks;
    for(const task of legacy.data.tasks){delete task.recurrence;delete task.successorOf;}
    expect(parseBackup(JSON.stringify(legacy)).data.tasks[0].recurrence).toBe('none');
    await db.repository.deleteGoal('g');
    await db.repository.restoreBackup(backup);
    expect((await db.repository.snapshot()).tasks[0].goalId).toBe('g');
    const broken = JSON.parse(backup);
    broken.data.tasks[0].goalId = 'missing';
    await expect(
      db.repository.restoreBackup(JSON.stringify(broken)),
    ).rejects.toThrow('invalidBackup');
    expect((await db.repository.snapshot()).goals).toHaveLength(1);
    broken.data.tasks[0].goalId = 'g';
    broken.data.tasks.push(broken.data.tasks[0]);
    expect(() => parseBackup(JSON.stringify(broken))).toThrow('invalidBackup');
    expect(() => parseBackup('{')).toThrow('invalidBackup');
    broken.version = 99;
    expect(() => parseBackup(JSON.stringify(broken))).toThrow('invalidBackup');
  } finally {
    db.close();
  }
});
test('focus elapsed time is monotonic, pause excludes breaks, recovery excludes process-dead time', () => {
  let now = 0;
  const clock = new FocusClock(1500, () => now);
  clock.start();
  now = 30000;
  expect(clock.seconds).toBe(30);
  clock.pause();
  now = 90000;
  expect(clock.seconds).toBe(30);
  clock.start();
  now = 120000;
  expect(clock.finish()).toBe(60);
  const recovered = new FocusClock(1500, () => now, 60);
  now = 9999999;
  expect(recovered.seconds).toBe(60);
  expect(recovered.state).toBe('paused');
});
