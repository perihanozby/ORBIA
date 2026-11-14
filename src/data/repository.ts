import {
  calendarDate,
  emptySnapshot,
  type Snapshot,
  type TaskItem,
} from '../domain/models';
import {
  localDate,
  validateTitle,
  type LocalDate,
} from '../domain/productivity';
import { parseBackup } from './backup';
import { writeTask, setTaskCompletion } from './taskOperations';

export type Value = string | number | null;
export interface SqlExecutor {
  execute(sql: string, params?: Value[]): Promise<Record<string, unknown>[]>;
}
export interface Database extends SqlExecutor {
  transaction<T>(work: (tx: SqlExecutor) => Promise<T>): Promise<T>;
}
export const schema = [
  'CREATE TABLE goals (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL CHECK(length(trim(title))>0), description TEXT NOT NULL, archived INTEGER NOT NULL DEFAULT 0 CHECK(archived IN (0,1)), createdAt TEXT NOT NULL)',
  'CREATE TABLE milestones (id TEXT PRIMARY KEY NOT NULL, goalId TEXT NOT NULL REFERENCES goals(id) ON DELETE CASCADE, title TEXT NOT NULL CHECK(length(trim(title))>0), completed INTEGER NOT NULL DEFAULT 0 CHECK(completed IN (0,1)))',
  'CREATE TABLE tasks (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL CHECK(length(trim(title))>0), description TEXT NOT NULL, dueDate TEXT, priority INTEGER NOT NULL CHECK(priority BETWEEN 0 AND 2), goalId TEXT REFERENCES goals(id) ON DELETE SET NULL, completedAt TEXT, createdAt TEXT NOT NULL)',
  'CREATE INDEX task_due ON tasks(dueDate, completedAt)',
  'CREATE INDEX task_goal ON tasks(goalId)',
  'CREATE TABLE selections (date TEXT NOT NULL, taskId TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE, slot INTEGER NOT NULL CHECK(slot BETWEEN 1 AND 3), PRIMARY KEY(date, taskId), UNIQUE(date, slot))',
  'CREATE TABLE habits (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL CHECK(length(trim(title))>0), description TEXT NOT NULL, weekdays TEXT NOT NULL, archived INTEGER NOT NULL DEFAULT 0 CHECK(archived IN (0,1)), createdAt TEXT NOT NULL)',
  "CREATE TABLE occurrences (habitId TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE, date TEXT NOT NULL, state TEXT NOT NULL CHECK(state IN ('complete','skipped')), PRIMARY KEY(habitId,date))",
  'CREATE INDEX occurrence_date ON occurrences(date)',
  'CREATE TABLE notes (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL, updatedAt TEXT NOT NULL)',
  'CREATE TABLE preferences (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL)',
];
let sequence = 0;
function id() {
  return `${Date.now().toString(36)}-${(++sequence).toString(
    36,
  )}-${Math.random().toString(36).slice(2, 12)}`;
}
export class Repository {
  constructor(private db: Database) {}
  async subtask(subtaskId: string, completed: boolean) {
    await this.db.execute('UPDATE subtasks SET completed=? WHERE id=?', [
      completed ? 1 : 0,
      subtaskId,
    ]);
  }
  async saveFocus(session: import('../domain/models').FocusSession) {
    await this.db.execute(
      'INSERT INTO focusSessions(id,durationSeconds,verifiedSeconds,state,createdAt,updatedAt) VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET verifiedSeconds=excluded.verifiedSeconds,state=excluded.state,updatedAt=excluded.updatedAt',
      [
        session.id,
        session.durationSeconds,
        session.verifiedSeconds,
        session.state,
        session.createdAt,
        session.updatedAt,
      ],
    );
  }
  async restoreBackup(input: string) {
    const backup = parseBackup(input);
    await this.db.transaction(async tx => {
      await tx.execute('PRAGMA defer_foreign_keys = ON');
      for (const table of [
        'focusSessions',
        'selections',
        'occurrences',
        'milestones',
        'tasks',
        'habits',
        'goals',
        'notes',
        'preferences',
      ]) {
        await tx.execute(`DELETE FROM ${table}`);
      }
      const columns: Record<string, string[]> = {
        subtasks: ['id', 'taskId', 'title', 'completed', 'position'],
        focusSessions: [
          'id',
          'durationSeconds',
          'verifiedSeconds',
          'state',
          'createdAt',
          'updatedAt',
        ],
        goals: ['id', 'title', 'description', 'archived', 'createdAt'],
        milestones: ['id', 'goalId', 'title', 'completed'],
        tasks: [
          'id',
          'title',
          'description',
          'dueDate',
          'priority',
          'goalId',
          'completedAt',
          'createdAt',
          'recurrence',
          'successorOf',
        ],
        habits: [
          'id',
          'title',
          'description',
          'weekdays',
          'archived',
          'createdAt',
        ],
        occurrences: ['habitId', 'date', 'state'],
        notes: ['id', 'title', 'body', 'updatedAt'],
      };
      for (const table of [
        'focusSessions',
        'goals',
        'milestones',
        'tasks',
        'habits',
        'occurrences',
        'notes',
        'subtasks',
      ] as const) {
        for (const value of backup.data[table]) {
          const row = value as unknown as Record<string, Value>;
          await tx.execute(
            `INSERT INTO ${table}(${columns[table].join(',')}) VALUES(${columns[
              table
            ]
              .map(() => '?')
              .join(',')})`,
            columns[table].map(key => row[key]),
          );
        }
      }
      const slots = new Map<string, number>();
      for (const row of backup.data.selections) {
        const slot = (slots.get(row.date) || 0) + 1;
        slots.set(row.date, slot);
        await tx.execute(
          'INSERT INTO selections(date,taskId,slot) VALUES(?,?,?)',
          [row.date, row.taskId, slot],
        );
      }
      for (const [key, value] of Object.entries(backup.data.preferences)) {
        await tx.execute('INSERT INTO preferences(key,value) VALUES(?,?)', [
          key,
          value,
        ]);
      }
    });
  }
  async initialize() {
    await this.db.execute('PRAGMA foreign_keys = ON');
    await this.db.execute('PRAGMA journal_mode = WAL');
    await this.db.transaction(async tx => {
      const rows = await tx.execute('PRAGMA user_version');
      const version = Number(rows[0]?.user_version ?? 0);
      if (version > 3) {
        throw new Error('futureDatabase');
      }
      if (version === 0) {
        for (const statement of schema) {
          await tx.execute(statement);
        }
      }
      if (version < 2) {
        await tx.execute(
          "CREATE TABLE focusSessions (id TEXT PRIMARY KEY NOT NULL, durationSeconds INTEGER NOT NULL CHECK(durationSeconds BETWEEN 60 AND 14400), verifiedSeconds INTEGER NOT NULL CHECK(verifiedSeconds>=0 AND verifiedSeconds<=durationSeconds), state TEXT NOT NULL CHECK(state IN ('running','paused','finished','cancelled')), createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL)",
        );
        await tx.execute('PRAGMA user_version = 2');
      }
      if (version < 3) {
        await tx.execute(
          "ALTER TABLE tasks ADD COLUMN recurrence TEXT NOT NULL DEFAULT 'none' CHECK(recurrence IN ('none','daily','weekly','monthly'))",
        );
        await tx.execute(
          'ALTER TABLE tasks ADD COLUMN successorOf TEXT REFERENCES tasks(id) ON DELETE SET NULL',
        );
        await tx.execute(
          'CREATE UNIQUE INDEX task_successor ON tasks(successorOf)',
        );
        await tx.execute(
          'CREATE TABLE subtasks(id TEXT PRIMARY KEY NOT NULL,taskId TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,title TEXT NOT NULL CHECK(length(trim(title))>0),completed INTEGER NOT NULL DEFAULT 0 CHECK(completed IN (0,1)),position INTEGER NOT NULL CHECK(position>=0))',
        );
        await tx.execute(
          'CREATE INDEX subtask_parent ON subtasks(taskId,position)',
        );
        await tx.execute('PRAGMA user_version = 3');
      }
    });
  }
  async snapshot(): Promise<Snapshot> {
    return this.db.transaction(async tx => {
      const result = emptySnapshot();
      for (const table of [
        'subtasks',
        'focusSessions',
        'tasks',
        'goals',
        'milestones',
        'habits',
        'occurrences',
        'notes',
        'selections',
      ] as const) {
        // Table names are an internal fixed allowlist, never user input.
        const rows = await tx.execute(`SELECT * FROM ${table}`);
        Object.assign(result, { [table]: rows });
      }
      const preferences = await tx.execute('SELECT key,value FROM preferences');
      result.preferences = Object.fromEntries(
        preferences.map(row => [String(row.key), String(row.value)]),
      );
      return result;
    });
  }
  async saveTask(
    input: Omit<TaskItem, 'createdAt' | 'completedAt'>,
    subtasks?: string[],
  ) {
    return writeTask(this.db, input, subtasks);
  }
  async completeTask(taskId: string, completed: boolean) {
    return setTaskCompletion(this.db, taskId, completed);
  }
  async deleteTask(taskId: string) {
    await this.db.execute('DELETE FROM tasks WHERE id=?', [taskId]);
  }
  async moveTask(taskId: string, date: LocalDate | null) {
    if (date) {
      localDate(date);
    }
    await this.db.execute('UPDATE tasks SET dueDate=? WHERE id=?', [
      date,
      taskId,
    ]);
  }
  async selectFocus(taskId: string, date = calendarDate()) {
    localDate(date);
    await this.db.transaction(async tx => {
      const rows = await tx.execute(
        'SELECT taskId,slot FROM selections WHERE date=?',
        [date],
      );
      if (rows.some(row => row.taskId === taskId)) {
        await tx.execute('DELETE FROM selections WHERE date=? AND taskId=?', [
          date,
          taskId,
        ]);
        return;
      }
      if (rows.length >= 3) {
        throw new Error('focusThreeLimit');
      }
      const slot = [1, 2, 3].find(n => !rows.some(row => row.slot === n))!;
      await tx.execute(
        'INSERT INTO selections(date,taskId,slot) VALUES(?,?,?)',
        [date, taskId, slot],
      );
    });
  }
  async saveGoal(
    goalId: string | null,
    title: string,
    description: string,
    milestones: string[],
  ) {
    const key = goalId || id();
    validateTitle(title);
    const titles = milestones.map(validateTitle);
    await this.db.transaction(async tx => {
      await tx.execute(
        'INSERT INTO goals(id,title,description,createdAt) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,description=excluded.description',
        [key, title.trim(), description, new Date().toISOString()],
      );
      for (const item of titles) {
        await tx.execute(
          'INSERT INTO milestones(id,goalId,title) VALUES(?,?,?)',
          [id(), key, item],
        );
      }
    });
  }
  async milestone(milestoneId: string, completed: boolean) {
    await this.db.execute('UPDATE milestones SET completed=? WHERE id=?', [
      completed ? 1 : 0,
      milestoneId,
    ]);
  }
  async deleteGoal(goalId: string) {
    await this.db.execute('DELETE FROM goals WHERE id=?', [goalId]);
  }
  async archiveGoal(goalId: string, archived: boolean) {
    await this.db.execute('UPDATE goals SET archived=? WHERE id=?', [
      archived ? 1 : 0,
      goalId,
    ]);
  }
  async saveHabit(
    habitId: string | null,
    title: string,
    description: string,
    weekdays: number[],
  ) {
    validateTitle(title);
    if (
      !weekdays.length ||
      weekdays.some(n => !Number.isInteger(n) || n < 0 || n > 6)
    ) {
      throw new Error('invalidSchedule');
    }
    await this.db.execute(
      'INSERT INTO habits(id,title,description,weekdays,createdAt) VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,description=excluded.description,weekdays=excluded.weekdays',
      [
        habitId || id(),
        title.trim(),
        description,
        [...new Set(weekdays)].sort().join(','),
        new Date().toISOString(),
      ],
    );
  }
  async trackHabit(
    habitId: string,
    date: LocalDate,
    state: 'complete' | 'skipped' | null,
  ) {
    localDate(date);
    if (!state) {
      await this.db.execute(
        'DELETE FROM occurrences WHERE habitId=? AND date=?',
        [habitId, date],
      );
    } else {
      await this.db.execute(
        'INSERT INTO occurrences(habitId,date,state) VALUES(?,?,?) ON CONFLICT(habitId,date) DO UPDATE SET state=excluded.state',
        [habitId, date, state],
      );
    }
  }
  async deleteHabit(habitId: string) {
    await this.db.execute('DELETE FROM habits WHERE id=?', [habitId]);
  }
  async saveNote(
    noteId: string | null,
    title: string,
    body: string,
  ): Promise<string> {
    const key = noteId || id();
    await this.db.execute(
      'INSERT INTO notes(id,title,body,updatedAt) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,body=excluded.body,updatedAt=excluded.updatedAt',
      [key, title, body, new Date().toISOString()],
    );
    return key;
  }
  async deleteNote(noteId: string) {
    await this.db.execute('DELETE FROM notes WHERE id=?', [noteId]);
  }
  async preference(key: string, value: string) {
    await this.db.execute(
      'INSERT INTO preferences(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',
      [key, value],
    );
  }
}
