export type LocalDate = string & { readonly __localDate: unique symbol };
export function localDate(value: string): LocalDate {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('invalidDate');
  }
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(12, 0, 0, 0);
  if (
    year < 1 ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error('invalidDate');
  }
  return value as LocalDate;
}
export interface Task {
  id: string;
  title: string;
  completedAt?: string;
  dueDate?: LocalDate;
}
export interface FocusSelection {
  date: LocalDate;
  taskId: string;
}
export function validateTitle(title: string): string {
  const result = title.trim();
  if (!result) {
    throw new Error('titleRequired');
  }
  if (result.length > 500) {
    throw new Error('titleTooLong');
  }
  return result;
}
export function selectPriority(
  selections: readonly FocusSelection[],
  task: Task,
  date: LocalDate,
): FocusSelection[] {
  if (selections.some(s => s.date === date && s.taskId === task.id)) {
    return [...selections];
  }
  if (selections.filter(s => s.date === date).length >= 3) {
    throw new Error('focusThreeLimit');
  }
  return [...selections, { date, taskId: task.id }];
}
export function goalProgress(
  milestones: readonly { completed: boolean }[],
): number {
  return milestones.length
    ? milestones.filter(m => m.completed).length / milestones.length
    : 0;
}
export type HabitState = 'complete' | 'skipped';
export interface HabitOccurrence {
  habitId: string;
  date: LocalDate;
  state: HabitState;
}
export function recordOccurrence(
  records: readonly HabitOccurrence[],
  occurrence: HabitOccurrence,
): HabitOccurrence[] {
  return [
    ...records.filter(
      r => !(r.habitId === occurrence.habitId && r.date === occurrence.date),
    ),
    occurrence,
  ];
}
