import type { LocalDate } from './productivity';

export interface TaskItem {
  recurrence?: import('./recurrence').Recurrence;
  successorOf?: string | null;
  id: string;
  title: string;
  description: string;
  dueDate: LocalDate | null;
  priority: number;
  goalId: string | null;
  completedAt: string | null;
  createdAt: string;
}
export interface Goal {
  id: string;
  title: string;
  description: string;
  archived: number;
  createdAt: string;
}
export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  completed: number;
}
export interface Habit {
  id: string;
  title: string;
  description: string;
  weekdays: string;
  archived: number;
  createdAt: string;
}
export interface Occurrence {
  habitId: string;
  date: LocalDate;
  state: 'complete' | 'skipped';
}
export interface Note {
  id: string;
  title: string;
  body: string;
  updatedAt: string;
}
export interface Snapshot {
  subtasks: Subtask[];
  focusSessions: FocusSession[];
  tasks: TaskItem[];
  goals: Goal[];
  milestones: Milestone[];
  habits: Habit[];
  occurrences: Occurrence[];
  notes: Note[];
  selections: { date: LocalDate; taskId: string }[];
  preferences: Record<string, string>;
}
export const emptySnapshot = (): Snapshot => ({
  subtasks: [],
  focusSessions: [],
  tasks: [],
  goals: [],
  milestones: [],
  habits: [],
  occurrences: [],
  notes: [],
  selections: [],
  preferences: {},
});
export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: number;
  position: number;
}
export interface FocusSession {
  id: string;
  durationSeconds: number;
  verifiedSeconds: number;
  state: 'running' | 'paused' | 'finished' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
export function calendarDate(date = new Date()): LocalDate {
  return `${String(date.getFullYear()).padStart(4, '0')}-${String(
    date.getMonth() + 1,
  ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` as LocalDate;
}
export function isHabitDue(habit: Habit, date: LocalDate): boolean {
  const [year, month, day] = date.split('-').map(Number);
  return (
    !habit.archived &&
    date >= calendarDate(new Date(habit.createdAt)) &&
    habit.weekdays
      .split(',')
      .includes(String(new Date(year, month - 1, day, 12).getDay()))
  );
}
