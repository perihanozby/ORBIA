import { calendarDate } from './models';
import { localDate, type LocalDate } from './productivity';
export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly';
export function nextOccurrence(
  date: LocalDate,
  rule: Exclude<Recurrence, 'none'>,
): LocalDate {
  localDate(date);
  const [year, month, day] = date.split('-').map(Number);
  const next = new Date(`${date}T12:00:00`);
  if (rule === 'daily' || rule === 'weekly') {
    next.setDate(next.getDate() + (rule === 'daily' ? 1 : 7));
  } else if (rule === 'monthly') {
    next.setDate(1);
    next.setMonth(month);
    next.setDate(Math.min(day, new Date(year, month + 1, 0, 12).getDate()));
  } else {
    throw new Error('invalidRecurrence');
  }
  return localDate(calendarDate(next));
}
