import { DatabaseSync } from 'node:sqlite';
import { Repository, type SqlExecutor } from '../src/data/repository';
export function testDatabase(filename = ':memory:') {
  const db = new DatabaseSync(filename);
  const executor: SqlExecutor = {
    async execute(sql, params = []) {
      const statement = db.prepare(sql);
      if (/^\s*(SELECT|PRAGMA)/i.test(sql)) {
        return statement.all(...params) as Record<string, unknown>[];
      }
      statement.run(...params);
      return [];
    },
  };
  const repository = new Repository({
    ...executor,
    async transaction(work) {
      db.exec('BEGIN IMMEDIATE');
      try {
        const result = await work(executor);
        db.exec('COMMIT');
        return result;
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },
  });
  return { repository, close: () => db.close() };
}
