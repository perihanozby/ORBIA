import type { Snapshot } from '../domain/models';
import { localDate, validateTitle } from '../domain/productivity';
export interface Backup {
  format: 'orbia';
  version: 1 | 2;
  exportedAt: string;
  data: Snapshot;
}
export const makeBackup = (data: Snapshot): string =>
  JSON.stringify(
    { format: 'orbia', version: 2, exportedAt: new Date().toISOString(), data },
    null,
    2,
  );
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('invalidBackup');
  }
  return value as Record<string, unknown>;
}
function text(value: unknown, nullable = false): boolean {
  return typeof value === 'string' || (nullable && value === null);
}
export function parseBackup(input: string): Backup {
  if (input.length > 10_000_000) {
    throw new Error('invalidBackup');
  }
  let raw: Record<string, unknown>;
  try {
    raw = object(JSON.parse(input));
  } catch {
    throw new Error('invalidBackup');
  }
  if (
    raw.format !== 'orbia' ||
    (raw.version !== 1 && raw.version !== 2) ||
    typeof raw.exportedAt !== 'string' ||
    !Number.isFinite(Date.parse(raw.exportedAt))
  ) {
    throw new Error('invalidBackup');
  }
  const data = object(raw.data);
  if (data.subtasks === undefined && raw.version === 1) {
    data.subtasks = [];
  }
  // Version-one exports predating focus sessions remain restorable.
  if (data.focusSessions === undefined && raw.version === 1) {
    data.focusSessions = [];
  }
  if (
    !Array.isArray(data.focusSessions) ||
    data.focusSessions.length > 100000
  ) {
    throw new Error('invalidBackup');
  }
  const focusIds = new Set<string>();
  for (const value of data.focusSessions) {
    const row = object(value);
    if (
      typeof row.id !== 'string' ||
      !row.id ||
      focusIds.has(row.id) ||
      !Number.isInteger(row.durationSeconds) ||
      Number(row.durationSeconds) < 60 ||
      Number(row.durationSeconds) > 14400 ||
      !Number.isInteger(row.verifiedSeconds) ||
      Number(row.verifiedSeconds) < 0 ||
      Number(row.verifiedSeconds) > Number(row.durationSeconds) ||
      !['running', 'paused', 'finished', 'cancelled'].includes(
        String(row.state),
      ) ||
      typeof row.createdAt !== 'string' ||
      !Number.isFinite(Date.parse(row.createdAt)) ||
      typeof row.updatedAt !== 'string' ||
      !Number.isFinite(Date.parse(row.updatedAt))
    ) {
      throw new Error('invalidBackup');
    }
    focusIds.add(row.id);
  }
  const tables = [
    'subtasks',
    'tasks',
    'goals',
    'milestones',
    'habits',
    'occurrences',
    'notes',
    'selections',
  ] as const;
  const ids: Record<string, Set<string>> = {};
  for (const table of tables) {
    const rows = data[table];
    if (!Array.isArray(rows) || rows.length > 100000) {
      throw new Error('invalidBackup');
    }
    ids[table] = new Set();
    for (const value of rows) {
      const row = object(value);
      if (!['occurrences', 'selections'].includes(table)) {
        if (
          typeof row.id !== 'string' ||
          !row.id ||
          row.id.length > 200 ||
          ids[table].has(row.id)
        ) {
          throw new Error('invalidBackup');
        }
        ids[table].add(row.id);
        if (!text(row.title)) {
          throw new Error('invalidBackup');
        }
        if (table !== 'notes') {
          validateTitle(row.title as string);
        }
      }
    }
  }
  const rows = (table: (typeof tables)[number]) =>
    data[table] as Record<string, unknown>[];
  const timestamp = (value: unknown) =>
    typeof value === 'string' && Number.isFinite(Date.parse(value));
  for (const row of rows('tasks')) {
    if (row.recurrence === undefined && raw.version === 1) {
      row.recurrence = 'none';
    }
    if (row.successorOf === undefined && raw.version === 1) {
      row.successorOf = null;
    }
    if (
      !['none', 'daily', 'weekly', 'monthly'].includes(
        String(row.recurrence),
      ) ||
      !text(row.successorOf, true) ||
      (row.successorOf !== null && !ids.tasks.has(row.successorOf as string))
    ) {
      throw new Error('invalidBackup');
    }
    if (
      !text(row.description) ||
      !text(row.dueDate, true) ||
      !text(row.goalId, true) ||
      !text(row.completedAt, true) ||
      !timestamp(row.createdAt) ||
      ![0, 1, 2].includes(row.priority as number)
    ) {
      throw new Error('invalidBackup');
    }
    if (row.dueDate !== null) {
      localDate(row.dueDate as string);
    }
    if (row.goalId !== null && !ids.goals.has(row.goalId as string)) {
      throw new Error('invalidBackup');
    }
    if (row.completedAt !== null && !timestamp(row.completedAt)) {
      throw new Error('invalidBackup');
    }
  }
  const parentMap = new Map(
    rows('tasks').map(row => [
      String(row.id),
      row.successorOf as string | null,
    ]),
  );
  const parents = new Set<string>();
  const resolved = new Set<string>();
  for (const row of rows('tasks')) {
    if (row.successorOf !== null) {
      if (parents.has(String(row.successorOf))) {
        throw new Error('invalidBackup');
      }
      parents.add(String(row.successorOf));
    }
    const visited = new Set<string>();
    let current: string | null = String(row.id);
    while (current !== null && !resolved.has(current)) {
      if (visited.has(current)) {
        throw new Error('invalidBackup');
      }
      visited.add(current);
      current = parentMap.get(current) || null;
    }
    for (const key of visited) {
      resolved.add(key);
    }
  }
  for (const row of rows('subtasks')) {
    if (
      !ids.tasks.has(row.taskId as string) ||
      ![0, 1].includes(row.completed as number) ||
      !Number.isInteger(row.position) ||
      Number(row.position) < 0
    ) {
      throw new Error('invalidBackup');
    }
  }
  for (const row of rows('goals')) {
    if (
      !text(row.description) ||
      ![0, 1].includes(row.archived as number) ||
      !timestamp(row.createdAt)
    ) {
      throw new Error('invalidBackup');
    }
  }
  for (const row of rows('milestones')) {
    if (
      !ids.goals.has(row.goalId as string) ||
      ![0, 1].includes(row.completed as number)
    ) {
      throw new Error('invalidBackup');
    }
  }
  for (const row of rows('habits')) {
    if (
      !text(row.description) ||
      ![0, 1].includes(row.archived as number) ||
      !timestamp(row.createdAt) ||
      typeof row.weekdays !== 'string' ||
      !/^([0-6])(?:,[0-6])*$/.test(row.weekdays) ||
      new Set(row.weekdays.split(',')).size !== row.weekdays.split(',').length
    ) {
      throw new Error('invalidBackup');
    }
  }
  const occurrenceKeys = new Set<string>();
  for (const row of rows('occurrences')) {
    if (
      !ids.habits.has(row.habitId as string) ||
      !['complete', 'skipped'].includes(row.state as string)
    ) {
      throw new Error('invalidBackup');
    }
    localDate(row.date as string);
    const key = JSON.stringify([row.habitId, row.date]);
    if (occurrenceKeys.has(key)) {
      throw new Error('invalidBackup');
    }
    occurrenceKeys.add(key);
  }
  const selections = new Set<string>();
  const slots = new Set<string>();
  const perDay = new Map<string, number>();
  for (const row of rows('selections')) {
    if (!ids.tasks.has(row.taskId as string)) {
      throw new Error('invalidBackup');
    }
    const date = localDate(row.date as string);
    const key = JSON.stringify([date, row.taskId]);
    if (selections.has(key)) {
      throw new Error('invalidBackup');
    }
    selections.add(key);
    const count = (perDay.get(date) || 0) + 1;
    if (count > 3) {
      throw new Error('invalidBackup');
    }
    perDay.set(date, count);
    if (row.slot !== undefined) {
      const slotKey = JSON.stringify([date, row.slot]);
      if (![1, 2, 3].includes(row.slot as number) || slots.has(slotKey)) {
        throw new Error('invalidBackup');
      }
      slots.add(slotKey);
    }
  }
  for (const row of rows('notes')) {
    if (!text(row.body) || !timestamp(row.updatedAt)) {
      throw new Error('invalidBackup');
    }
  }
  const prefs = object(data.preferences);
  if (
    Object.keys(prefs).length > 100 ||
    Object.entries(prefs).some(
      ([key, value]) =>
        !key || typeof value !== 'string' || value.length > 100000,
    )
  ) {
    throw new Error('invalidBackup');
  }
  return raw as unknown as Backup;
}
