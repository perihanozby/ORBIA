import { ReminderSettings } from '../settings/ReminderSettings';
import { FocusPanel } from '../focus/FocusPanel';
import { BackupPanel } from '../backup/BackupPanel';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, BackHandler, FlatList, ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useApp } from '../../app/store';
import {
  calendarDate,
  isHabitDue,
  type Goal,
  type Habit,
  type TaskItem,
} from '../../domain/models';
import {
  Button,
  Card,
  Check,
  Empty,
  Field,
  Label,
  Section,
  styles,
  useUi,
} from '../../ui/kit';
import type { EditRequest } from '../editor/Editor';
import type { StringKey } from '../../app/strings';

export type OpenEditor = (request: EditRequest) => void;
function useToday() {
  const [today, setToday] = useState(calendarDate());
  useEffect(() => {
    const timer = setInterval(() => setToday(calendarDate()), 15000);
    return () => clearInterval(timer);
  }, []);
  return today;
}
function useDelete() {
  const { t } = useUi();
  return (action: () => void) =>
    Alert.alert(t('deleteTitle'), t('deleteBody'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('delete'), style: 'destructive', onPress: action },
    ]);
}
export function TaskCard({ task, open }: { task: TaskItem; open: OpenEditor }) {
  const { t, language } = useUi();
  const { data, run, busy } = useApp();
  const today = useToday();
  const confirm = useDelete();
  const selected = data.selections.some(
    s => s.date === today && s.taskId === task.id,
  );
  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <Check
          checked={!!task.completedAt}
          label={`${t(task.completedAt ? 'undo' : 'done')}: ${task.title}`}
          onPress={() => {
            if (!busy) {
              run(r => r.completeTask(task.id, !task.completedAt));
            }
          }}
        />
        <View style={{ flex: 1, gap: 4, paddingTop: 10 }}>
          <Label
            bold
            style={
              task.completedAt
                ? { textDecorationLine: 'line-through', opacity: 0.65 }
                : undefined
            }
          >
            {task.title}
          </Label>
          {task.description ? <Label muted>{task.description}</Label> : null}
          <Label muted size={12}>
            {task.dueDate
              ? new Intl.DateTimeFormat(language, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }).format(new Date(`${task.dueDate}T12:00:00`))
              : t('backlog')}
            {task.priority > 0
              ? ` · ${t(task.priority === 2 ? 'high' : 'important')}`
              : ''}
          </Label>
        </View>
      </View>
      {data.subtasks
        .filter(item => item.taskId === task.id)
        .sort((a, b) => a.position - b.position)
        .map(item => (
          <View
            key={item.id}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Check
              checked={!!item.completed}
              label={item.title}
              onPress={() => {
                run(repo => repo.subtask(item.id, !item.completed));
              }}
            />
            <View style={{ flex: 1 }}>
              <Label muted>{item.title}</Label>
            </View>
          </View>
        ))}
      <View style={styles.row}>
        <Button
          secondary
          selected={selected}
          label={t(selected ? 'removeFocus' : 'selectFocus')}
          disabled={busy}
          onPress={() => {
            run(r => r.selectFocus(task.id, today));
          }}
        />
        <Button
          secondary
          label={t('edit')}
          onPress={() => open({ kind: 'task', item: task })}
        />
        <Button
          secondary
          label={t('delete')}
          onPress={() =>
            confirm(() => {
              run(r => r.deleteTask(task.id));
            })
          }
        />
      </View>
      {!task.completedAt && task.dueDate && task.dueDate < today && (
        <View style={styles.row}>
          <Button
            secondary
            label={t('moveToday')}
            onPress={() => {
              run(r => r.moveTask(task.id, today));
            }}
          />
          <Button
            secondary
            label={t('backlog')}
            onPress={() => {
              run(r => r.moveTask(task.id, null));
            }}
          />
        </View>
      )}
    </Card>
  );
}
export function HabitCard({ habit, open }: { habit: Habit; open: OpenEditor }) {
  const { t, c, isDark, language } = useUi();
  const { data, run, busy } = useApp();
  const today = useToday();
  const confirm = useDelete();
  const occurrence = data.occurrences.find(
    o => o.habitId === habit.id && o.date === today,
  );
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(`${today}T12:00:00`);
    date.setDate(date.getDate() - 6 + i);
    return calendarDate(date);
  });
  return (
    <Card tint={isDark ? c.surface : c.peach}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Label size={18} bold>
            {habit.title}
          </Label>
          {habit.description ? <Label muted>{habit.description}</Label> : null}
        </View>
        <Check
          checked={occurrence?.state === 'complete'}
          label={`${t(occurrence?.state === 'complete' ? 'undo' : 'done')}: ${
            habit.title
          }`}
          onPress={() => {
            if (!busy) {
              run(r =>
                r.trackHabit(
                  habit.id,
                  today,
                  occurrence?.state === 'complete' ? null : 'complete',
                ),
              );
            }
          }}
        />
      </View>
      <View style={styles.row}>
        {week.map(date => {
          const complete = data.occurrences.some(
            o =>
              o.habitId === habit.id &&
              o.date === date &&
              o.state === 'complete',
          );
          return (
            <View
              key={date}
              style={{ alignItems: 'center', gap: 5, minWidth: 28 }}
            >
              <Label size={11} muted>
                {new Intl.DateTimeFormat(language, {
                  weekday: 'narrow',
                }).format(new Date(`${date}T12:00:00`))}
              </Label>
              <View
                accessibilityLabel={`${date}: ${
                  complete ? t('completed') : t('none')
                }`}
                style={{
                  width: 23,
                  height: 23,
                  borderRadius: 12,
                  backgroundColor: complete ? c.primary : c.surface,
                  borderWidth: 1,
                  borderColor: c.border,
                }}
              >
                {complete ? (
                  <Label
                    size={12}
                    style={{ textAlign: 'center', color: c.background }}
                  >
                    ✓
                  </Label>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.row}>
        <Button
          secondary
          label={t(occurrence?.state === 'skipped' ? 'undo' : 'skip')}
          disabled={busy}
          onPress={() => {
            run(r =>
              r.trackHabit(
                habit.id,
                today,
                occurrence?.state === 'skipped' ? null : 'skipped',
              ),
            );
          }}
        />
        <Button
          secondary
          label={t('edit')}
          onPress={() => open({ kind: 'habit', item: habit })}
        />
        <Button
          secondary
          label={t('delete')}
          onPress={() =>
            confirm(() => {
              run(r => r.deleteHabit(habit.id));
            })
          }
        />
      </View>
      {occurrence?.state === 'skipped' && <Label muted>{t('skipped')}</Label>}
    </Card>
  );
}
export function GoalCard({ goal, open }: { goal: Goal; open: OpenEditor }) {
  const { t, c, isDark, language } = useUi();
  const { data, run } = useApp();
  const confirm = useDelete();
  const milestones = data.milestones.filter(m => m.goalId === goal.id);
  const done = milestones.filter(m => m.completed).length;
  const progress = milestones.length ? done / milestones.length : 0;
  return (
    <Card tint={isDark ? c.surface : c.lavender}>
      <Label size={20} bold>
        {goal.title}
      </Label>
      {goal.description ? <Label muted>{goal.description}</Label> : null}
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: milestones.length, now: done }}
        style={{
          height: 6,
          borderRadius: 4,
          backgroundColor: c.surface,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: 6,
            width: `${progress * 100}%`,
            backgroundColor: c.primary,
          }}
        />
      </View>
      <Label muted>
        {new Intl.NumberFormat(language, {
          style: 'percent',
          maximumFractionDigits: 0,
        }).format(progress)}
      </Label>
      {milestones.map(m => (
        <View key={m.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Check
            checked={!!m.completed}
            label={m.title}
            onPress={() => {
              run(r => r.milestone(m.id, !m.completed));
            }}
          />
          <View style={{ flex: 1 }}>
            <Label>{m.title}</Label>
          </View>
        </View>
      ))}
      {data.tasks
        .filter(task => task.goalId === goal.id)
        .map(task => (
          <Button
            key={task.id}
            secondary
            label={task.title}
            onPress={() => open({ kind: 'task', item: task })}
          />
        ))}
      <View style={styles.row}>
        <Button
          secondary
          label={t('edit')}
          onPress={() => open({ kind: 'goal', item: goal })}
        />
        <Button
          secondary
          label={t(goal.archived ? 'restore' : 'archive')}
          onPress={() => {
            run(r => r.archiveGoal(goal.id, !goal.archived));
          }}
        />
        <Button
          secondary
          label={t('delete')}
          onPress={() =>
            confirm(() => {
              run(r => r.deleteGoal(goal.id));
            })
          }
        />
      </View>
    </Card>
  );
}
export function TodayScreen({ open }: { open: OpenEditor }) {
  const { data } = useApp();
  const { t, c, language } = useUi();
  const today = useToday();
  const tasks = data.tasks.filter(task => task.dueDate === today);
  const completed = tasks.filter(task => task.completedAt).length;
  const selected = data.selections
    .filter(s => s.date === today)
    .map(s => data.tasks.find(task => task.id === s.taskId))
    .filter((task): task is TaskItem => !!task);
  const habits = data.habits.filter(h => isHabitDue(h, today));
  const overdue = data.tasks.filter(
    task => !task.completedAt && task.dueDate && task.dueDate < today,
  );
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Label bold size={20}>
            ORBIA
          </Label>
          <Label muted size={12}>
            {t('tagline')}
          </Label>
        </View>
        <Label muted size={12}>
          {new Intl.DateTimeFormat(language, {
            month: 'short',
            day: 'numeric',
          }).format(new Date())}
        </Label>
      </View>
      <View style={{ gap: 12 }}>
        <Label muted size={11} bold>
          {t('compass')}
        </Label>
        <Label size={34} bold>
          {t('greeting')}
        </Label>
      </View>
      <Card tint={c.secondarySurface}>
        <Label bold size={18}>
          {t('progress')}
        </Label>
        <Label size={38} bold>
          {completed} / {tasks.length}
        </Label>
        <Label muted>{t('completed')}</Label>
        <View
          style={{ height: 5, backgroundColor: c.surface, borderRadius: 5 }}
        >
          <View
            style={{
              height: 5,
              width: `${tasks.length ? (completed / tasks.length) * 100 : 0}%`,
              backgroundColor: c.primary,
              borderRadius: 5,
            }}
          />
        </View>
      </Card>
      <Section title={t('focusThree')}>
        <Label muted>{t('focusHint')}</Label>
        {selected.length ? (
          selected.map(task => (
            <TaskCard key={task.id} task={task} open={open} />
          ))
        ) : (
          <Button
            secondary
            label={t('addTask')}
            onPress={() => open({ kind: 'task', date: today })}
          />
        )}
      </Section>
      <Section title={t('todayTasks')}>
        {tasks.length ? (
          tasks.map(task => <TaskCard key={task.id} task={task} open={open} />)
        ) : (
          <Empty
            title={t('emptyTasks')}
            body={t('emptyTasksBody')}
            action={
              <Button
                label={t('addTask')}
                onPress={() => open({ kind: 'task', date: today })}
              />
            }
          />
        )}
      </Section>
      {overdue.length > 0 && (
        <Section title={t('gentleReset')}>
          <Label muted>{t('resetBody')}</Label>
          {overdue.map(task => (
            <TaskCard key={task.id} task={task} open={open} />
          ))}
        </Section>
      )}
      <Section title={t('todayHabits')}>
        {habits.length ? (
          habits.map(habit => (
            <HabitCard key={habit.id} habit={habit} open={open} />
          ))
        ) : (
          <Button
            secondary
            label={t('addHabit')}
            onPress={() => open({ kind: 'habit' })}
          />
        )}
      </Section>
      {data.goals.some(g => !g.archived) && (
        <Section title={t('goalPath')}>
          {data.goals
            .filter(g => !g.archived)
            .slice(0, 2)
            .map(goal => (
              <GoalCard key={goal.id} goal={goal} open={open} />
            ))}
        </Section>
      )}
      <Button
        label={t('addTask')}
        onPress={() => open({ kind: 'task', date: today })}
      />
    </ScrollView>
  );
}
export function TasksScreen({ open }: { open: OpenEditor }) {
  const { data } = useApp();
  const { t } = useUi();
  const today = useToday();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<StringKey>('all');
  const tasks = data.tasks
    .filter(task =>
      task.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
    )
    .filter(
      task =>
        filter === 'all' ||
        (filter === 'completed' && !!task.completedAt) ||
        (filter === 'today' && task.dueDate === today) ||
        (filter === 'upcoming' &&
          !task.completedAt &&
          !!task.dueDate &&
          task.dueDate > today) ||
        (filter === 'overdue' &&
          !task.completedAt &&
          !!task.dueDate &&
          task.dueDate < today),
    )
    .sort(
      (a, b) =>
        Number(!!a.completedAt) - Number(!!b.completedAt) ||
        b.priority - a.priority ||
        (a.dueDate || '9999').localeCompare(b.dueDate || '9999'),
    );
  return (
    <FlatList
      data={tasks}
      keyExtractor={task => task.id}
      renderItem={({ item }) => <TaskCard task={item} open={open} />}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.page}
      ListHeaderComponent={
        <View style={{ gap: 24, marginBottom: 24 }}>
          <Label size={30} bold>
            {t('tasks')}
          </Label>
          <Field label={t('search')} value={query} onChangeText={setQuery} />
          <View style={styles.row}>
            {(
              ['all', 'today', 'upcoming', 'completed', 'overdue'] as const
            ).map(key => (
              <Button
                key={key}
                secondary
                selected={filter === key}
                label={t(key)}
                onPress={() => setFilter(key)}
              />
            ))}
          </View>
          <Button label={t('addTask')} onPress={() => open({ kind: 'task' })} />
        </View>
      }
      ListEmptyComponent={
        <Empty title={t('emptyTasks')} body={t('emptyTasksBody')} />
      }
    />
  );
}
export function GoalsScreen({ open }: { open: OpenEditor }) {
  const { data } = useApp();
  const { t } = useUi();
  const [archived, setArchived] = useState(false);
  const goals = data.goals.filter(g => !!g.archived === archived);
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Label size={30} bold>
        {t('goals')}
      </Label>
      <Label muted>{t('emptyGoalsBody')}</Label>
      <View style={styles.row}>
        <Button
          secondary
          selected={!archived}
          label={t('activeGoals')}
          onPress={() => setArchived(false)}
        />
        <Button
          secondary
          selected={archived}
          label={t('archived')}
          onPress={() => setArchived(true)}
        />
      </View>
      <Button label={t('addGoal')} onPress={() => open({ kind: 'goal' })} />
      {goals.map(goal => (
        <GoalCard key={goal.id} goal={goal} open={open} />
      ))}
      {!goals.length && (
        <Empty title={t('emptyGoals')} body={t('emptyGoalsBody')} />
      )}
    </ScrollView>
  );
}
export function HabitsScreen({ open }: { open: OpenEditor }) {
  const { data } = useApp();
  const { t } = useUi();
  const today = useToday();
  const habits = data.habits
    .filter(h => !h.archived)
    .sort(
      (a, b) => Number(isHabitDue(b, today)) - Number(isHabitDue(a, today)),
    );
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Label size={30} bold>
        {t('habits')}
      </Label>
      <Label muted>{t('emptyHabitsBody')}</Label>
      <Button label={t('addHabit')} onPress={() => open({ kind: 'habit' })} />
      {habits.map(habit => (
        <HabitCard key={habit.id} habit={habit} open={open} />
      ))}
      {!habits.length && (
        <Empty title={t('emptyHabits')} body={t('emptyHabitsBody')} />
      )}
    </ScrollView>
  );
}
export function MoreScreen({ open }: { open: OpenEditor }) {
  const { data, run } = useApp();
  const { t, c, language } = useUi();
  const confirm = useDelete();
  const [page, setPage] = useState<
    | 'menu'
    | 'notes'
    | 'calendar'
    | 'insights'
    | 'search'
    | 'settings'
    | 'about'
    | 'backup'
    | 'focus'
  >('menu');
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (page !== 'menu') {
            setPage('menu');
            return true;
          }
          return false;
        },
      );
      return () => subscription.remove();
    }, [page]),
  );
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(calendarDate());
  const [month, setMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1, 12),
  );
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const lower = query.toLocaleLowerCase(language);
  const matches = (value: string) =>
    value.toLocaleLowerCase(language).includes(lower);
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.page}
    >
      <Label size={30} bold>
        {t(page === 'menu' ? 'more' : page)}
      </Label>
      {page !== 'menu' && (
        <Button secondary label={t('more')} onPress={() => setPage('menu')} />
      )}
      {page === 'menu' && (
        <>
          <Label muted>{t('tagline')}</Label>
          {(
            [
              'calendar',
              'notes',
              'insights',
              'search',
              'settings',
              'focus',
              'backup',
              'about',
            ] as const
          ).map(key => (
            <Button
              key={key}
              secondary
              label={t(key)}
              onPress={() => setPage(key)}
            />
          ))}
        </>
      )}
      {page === 'notes' && (
        <>
          <Label muted>{t('notesHint')}</Label>
          <Field label={t('search')} value={query} onChangeText={setQuery} />
          <Button label={t('addNote')} onPress={() => open({ kind: 'note' })} />
          {data.notes
            .filter(n => matches(n.title + ' ' + n.body))
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
            .map(note => (
              <Card key={note.id}>
                <Label bold size={18}>
                  {note.title || t('notes')}
                </Label>
                <Label muted>{note.body}</Label>
                <View style={styles.row}>
                  <Button
                    secondary
                    label={t('edit')}
                    onPress={() => open({ kind: 'note', item: note })}
                  />
                  <Button
                    secondary
                    label={t('delete')}
                    onPress={() =>
                      confirm(() => {
                        run(r => r.deleteNote(note.id));
                      })
                    }
                  />
                </View>
              </Card>
            ))}
        </>
      )}
      {page === 'calendar' && (
        <>
          <Label muted>{t('calendarHint')}</Label>
          <View style={styles.row}>
            <Button
              secondary
              label={t('previous')}
              onPress={() =>
                setMonth(
                  new Date(month.getFullYear(), month.getMonth() - 1, 1, 12),
                )
              }
            />
            <Label bold>
              {new Intl.DateTimeFormat(language, {
                month: 'long',
                year: 'numeric',
              }).format(month)}
            </Label>
            <Button
              secondary
              label={t('next')}
              onPress={() =>
                setMonth(
                  new Date(month.getFullYear(), month.getMonth() + 1, 1, 12),
                )
              }
            />
          </View>
          <View style={styles.row}>
            {Array.from({ length: days }, (_, i) => {
              const date = calendarDate(
                new Date(month.getFullYear(), month.getMonth(), i + 1, 12),
              );
              return (
                <Button
                  key={date}
                  secondary
                  selected={date === selected}
                  label={`${i + 1}${
                    data.tasks.some(task => task.dueDate === date) ? ' ·' : ''
                  }`}
                  onPress={() => setSelected(date)}
                />
              );
            })}
          </View>
          <Label size={19} bold>
            {selected}
          </Label>
          <Button
            label={t('addTask')}
            onPress={() => open({ kind: 'task', date: selected })}
          />
          {data.tasks
            .filter(task => task.dueDate === selected)
            .map(task => (
              <TaskCard key={task.id} task={task} open={open} />
            ))}
          {data.habits
            .filter(h => isHabitDue(h, selected))
            .map(h => (
              <Card key={h.id}>
                <Label>{h.title}</Label>
                <Label muted>
                  {data.occurrences.find(
                    o => o.habitId === h.id && o.date === selected,
                  )?.state === 'complete'
                    ? t('completed')
                    : t('habits')}
                </Label>
              </Card>
            ))}
        </>
      )}
      {page === 'insights' && (
        <>
          <Label muted>{t('insightsHint')}</Label>
          {(
            [
              {
                key: 'taskCount',
                value: data.tasks.filter(task => task.completedAt).length,
              },
              {
                key: 'trackedHabits',
                value: data.occurrences.filter(o => o.state === 'complete')
                  .length,
              },
              {
                key: 'activeGoals',
                value: data.goals.filter(g => !g.archived).length,
              },
            ] as const
          ).map(metric => (
            <Card key={metric.key}>
              <Label size={34} bold>
                {new Intl.NumberFormat(language).format(metric.value)}
              </Label>
              <Label muted>{t(metric.key)}</Label>
            </Card>
          ))}
          <Section title={t('goalPath')}>
            {data.goals
              .filter(g => !g.archived)
              .map(goal => (
                <GoalCard key={goal.id} goal={goal} open={open} />
              ))}
          </Section>
        </>
      )}
      {page === 'search' && (
        <>
          <Field
            label={t('searchHint')}
            value={query}
            onChangeText={setQuery}
          />
          {query.trim() && (
            <>
              <Section title={t('tasks')}>
                {data.tasks
                  .filter(task => matches(task.title + ' ' + task.description))
                  .map(task => (
                    <TaskCard key={task.id} task={task} open={open} />
                  ))}
              </Section>
              <Section title={t('goals')}>
                {data.goals
                  .filter(g => matches(g.title))
                  .map(g => (
                    <Button
                      key={g.id}
                      secondary
                      label={g.title}
                      onPress={() => open({ kind: 'goal', item: g })}
                    />
                  ))}
              </Section>
              <Section title={t('habits')}>
                {data.habits
                  .filter(h => matches(h.title))
                  .map(h => (
                    <Button
                      key={h.id}
                      secondary
                      label={h.title}
                      onPress={() => open({ kind: 'habit', item: h })}
                    />
                  ))}
              </Section>
              <Section title={t('notes')}>
                {data.notes
                  .filter(n => matches(n.title + ' ' + n.body))
                  .map(n => (
                    <Button
                      key={n.id}
                      secondary
                      label={n.title || t('notes')}
                      onPress={() => open({ kind: 'note', item: n })}
                    />
                  ))}
              </Section>
            </>
          )}
        </>
      )}
      {page === 'settings' && (
        <>
          <Section title={t('language')}>
            <View style={styles.row}>
              <Button
                secondary
                selected={language === 'en'}
                label="English"
                onPress={() => {
                  run(r => r.preference('language', 'en'));
                }}
              />
              <Button
                secondary
                selected={language === 'tr'}
                label={t('turkishName')}
                onPress={() => {
                  run(r => r.preference('language', 'tr'));
                }}
              />
            </View>
          </Section>
          <ReminderSettings />
          <Section title={t('appearance')}>
            <View style={styles.row}>
              {(['system', 'light', 'dark'] as const).map(value => (
                <Button
                  key={value}
                  secondary
                  selected={(data.preferences.appearance || 'system') === value}
                  label={t(value)}
                  onPress={() => {
                    run(r => r.preference('appearance', value));
                  }}
                />
              ))}
            </View>
          </Section>
          <Card>
            <Label bold>{t('privacy')}</Label>
            <Label muted>{t('privacyBody')}</Label>
          </Card>
        </>
      )}
      {page === 'focus' && <FocusPanel />}
      {page === 'backup' && <BackupPanel />}
      {page === 'about' && (
        <Card>
          <View
            style={[styles.orbit, { borderColor: c.primary, margin: 12 }]}
          />
          <Label size={28} bold>
            ORBIA
          </Label>
          <Label muted>{t('aboutBody')}</Label>
        </Card>
      )}
    </ScrollView>
  );
}
