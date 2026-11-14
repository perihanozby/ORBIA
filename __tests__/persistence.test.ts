import { mkdtempSync, rmdirSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { testDatabase } from '../test-utils/database';
test('SQLite task data and settings survive closing and reopening the database file', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'orbia-persistence-'));
  const filename = join(directory, 'orbia.sqlite');
  let connection = testDatabase(filename);
  try {
    await connection.repository.initialize();
    await connection.repository.saveTask({
      id: 'persistent',
      title: 'Keep this',
      description: 'Across restarts',
      dueDate: null,
      priority: 2,
      goalId: null,
    });
    await connection.repository.preference('language', 'tr');
    connection.close();
    connection = testDatabase(filename);
    await connection.repository.initialize();
    const data = await connection.repository.snapshot();
    expect(data.tasks[0].title).toBe('Keep this');
    expect(data.preferences.language).toBe('tr');
  } finally {
    connection.close();
    unlinkSync(filename);
    rmdirSync(directory);
  }
});
