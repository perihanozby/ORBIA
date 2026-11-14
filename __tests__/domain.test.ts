import {
  goalProgress,
  localDate,
  recordOccurrence,
  selectPriority,
  validateTitle,
} from '../src/domain/productivity';

test('rejects empty task titles and normalizes whitespace', () => {
  expect(() => validateTitle('  ')).toThrow('titleRequired');
  expect(validateTitle(' Read ')).toBe('Read');
});
test('validates calendar dates including leap years', () => {
  expect(localDate('2024-02-29')).toBe('2024-02-29');
  expect(() => localDate('2026-02-29')).toThrow('invalidDate');
  expect(() => localDate('2026-04-31')).toThrow('invalidDate');
});
test('Focus Three retains completed slots, is idempotent and isolates dates', () => {
  const today = localDate('2026-11-14');
  let rows = selectPriority(
    [],
    { id: 'a', title: 'A', completedAt: '2026-11-14T10:00:00Z' },
    today,
  );
  rows = selectPriority(rows, { id: 'b', title: 'B' }, today);
  rows = selectPriority(rows, { id: 'c', title: 'C' }, today);
  expect(selectPriority(rows, { id: 'a', title: 'A' }, today)).toHaveLength(3);
  expect(() => selectPriority(rows, { id: 'd', title: 'D' }, today)).toThrow(
    'focusThreeLimit',
  );
  expect(
    selectPriority(rows, { id: 'd', title: 'D' }, localDate('2026-11-15')),
  ).toHaveLength(4);
});
test('goal progress handles empty and partial milestones', () => {
  expect(goalProgress([])).toBe(0);
  expect(goalProgress([{ completed: true }, { completed: false }])).toBe(0.5);
});
test('habit updates never duplicate a habit and calendar date', () => {
  const date = localDate('2026-11-14');
  const rows = recordOccurrence([], { habitId: 'a', date, state: 'complete' });
  expect(
    recordOccurrence(rows, { habitId: 'a', date, state: 'skipped' }),
  ).toEqual([{ habitId: 'a', date, state: 'skipped' }]);
  expect(
    recordOccurrence(rows, { habitId: 'b', date, state: 'complete' }),
  ).toHaveLength(2);
});
