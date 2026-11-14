import type { Database } from './repository';
import type { TaskItem } from '../domain/models';
import { localDate, validateTitle } from '../domain/productivity';
import { nextOccurrence } from '../domain/recurrence';
let counter = 0;
const newId = () =>
  `task-${Date.now()}-${++counter}-${Math.random().toString(36).slice(2)}`;
export async function writeTask(
  db: Database,
  input: Omit<TaskItem, 'createdAt' | 'completedAt'>,
  subtasks?: string[],
) {
  const title = validateTitle(input.title);
  const rule = input.recurrence || 'none';
  if (input.dueDate) {
    localDate(input.dueDate);
  }
  if (
    !['none', 'daily', 'weekly', 'monthly'].includes(rule) ||
    (rule !== 'none' && !input.dueDate)
  ) {
    throw new Error('invalidRecurrence');
  }
  if (![0, 1, 2].includes(input.priority)) {
    throw new Error('invalidPriority');
  }
  const titles = subtasks?.map(validateTitle);
  const key = input.id || newId();
  await db.transaction(async tx => {
    await tx.execute(
      'INSERT INTO tasks(id,title,description,dueDate,priority,goalId,createdAt,recurrence) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,description=excluded.description,dueDate=excluded.dueDate,priority=excluded.priority,goalId=excluded.goalId,recurrence=excluded.recurrence',
      [
        key,
        title,
        input.description,
        input.dueDate,
        input.priority,
        input.goalId,
        new Date().toISOString(),
        rule,
      ],
    );
    if (titles) {
      const existing = await tx.execute(
        'SELECT * FROM subtasks WHERE taskId=? ORDER BY position',
        [key],
      );
      const retained = new Set<string>();
      for (let position = 0; position < titles.length; position++) {
        const match = existing.find(
          row =>
            row.title === titles[position] && !retained.has(String(row.id)),
        );
        const subtaskId = match ? String(match.id) : newId();
        retained.add(subtaskId);
        await tx.execute(
          'INSERT INTO subtasks(id,taskId,title,completed,position) VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET position=excluded.position',
          [
            subtaskId,
            key,
            titles[position],
            match ? Number(match.completed) : 0,
            position,
          ],
        );
      }
      for (const row of existing) {
        if (!retained.has(String(row.id))) {
          await tx.execute('DELETE FROM subtasks WHERE id=?', [String(row.id)]);
        }
      }
    }
  });
}
export async function setTaskCompletion(
  db: Database,
  taskId: string,
  completed: boolean,
) {
  await db.transaction(async tx => {
    const row = (
      await tx.execute('SELECT * FROM tasks WHERE id=?', [taskId])
    )[0] as unknown as TaskItem | undefined;
    if (!row) {
      return;
    }
    await tx.execute('UPDATE tasks SET completedAt=? WHERE id=?', [
      completed ? new Date().toISOString() : null,
      taskId,
    ]);
    if (
      !completed ||
      row.completedAt ||
      !row.dueDate ||
      !row.recurrence ||
      row.recurrence === 'none'
    ) {
      return;
    }
    if (
      (await tx.execute('SELECT id FROM tasks WHERE successorOf=?', [taskId]))
        .length
    ) {
      return;
    }
    const key = newId();
    await tx.execute(
      'INSERT INTO tasks(id,title,description,dueDate,priority,goalId,createdAt,recurrence,successorOf) VALUES(?,?,?,?,?,?,?,?,?)',
      [
        key,
        row.title,
        row.description,
        nextOccurrence(row.dueDate, row.recurrence),
        row.priority,
        row.goalId,
        new Date().toISOString(),
        row.recurrence,
        taskId,
      ],
    );
    const subtasks = await tx.execute(
      'SELECT title,position FROM subtasks WHERE taskId=?',
      [taskId],
    );
    for (const item of subtasks) {
      await tx.execute(
        'INSERT INTO subtasks(id,taskId,title,completed,position) VALUES(?,?,?,0,?)',
        [newId(), key, String(item.title), Number(item.position)],
      );
    }
  });
}
