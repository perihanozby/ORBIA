import React, { useEffect, useRef, useState } from 'react';
import { Alert, Modal, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../app/store';
import { localDate } from '../../domain/productivity';
import type { Goal, Habit, Note, TaskItem } from '../../domain/models';
import { Button, Field, Label, styles, useUi } from '../../ui/kit';
import { useReducedMotion } from '../../ui/useReducedMotion';
import type { Recurrence } from '../../domain/recurrence';
export type EditRequest =
  | { kind: 'task'; item?: TaskItem; date?: string }
  | { kind: 'goal'; item?: Goal }
  | { kind: 'habit'; item?: Habit }
  | { kind: 'note'; item?: Note };
export function Editor({
  request,
  close,
}: {
  request: EditRequest;
  close: () => void;
}) {
  const { t, c } = useUi();
  const reducedMotion = useReducedMotion();
  const { data, run, busy } = useApp();
  const original = request.item;
  const noteId = useRef(
    original?.id || `note-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  const revision = useRef(0);
  const [autosaved, setAutosaved] = useState(false);
  const [title, setTitle] = useState(original?.title || '');
  const [description, setDescription] = useState(
    original && 'description' in original
      ? original.description
      : original && 'body' in original
      ? original.body
      : '',
  );
  const [date, setDate] = useState(
    request.kind === 'task' ? request.item?.dueDate || request.date || '' : '',
  );
  const [priority, setPriority] = useState(
    request.kind === 'task' ? request.item?.priority || 0 : 0,
  );
  const [recurrence, setRecurrence] = useState<Recurrence>(
    request.kind === 'task' ? request.item?.recurrence || 'none' : 'none',
  );
  const [subtasks, setSubtasks] = useState(
    request.kind === 'task' && request.item
      ? data.subtasks
          .filter(item => item.taskId === request.item!.id)
          .sort((a, b) => a.position - b.position)
          .map(item => item.title)
          .join('\n')
      : '',
  );
  const [goalId, setGoalId] = useState(
    request.kind === 'task' ? request.item?.goalId || null : null,
  );
  const [milestones, setMilestones] = useState('');
  const [weekdays, setWeekdays] = useState(
    request.kind === 'habit' && request.item
      ? request.item.weekdays.split(',').map(Number)
      : [0, 1, 2, 3, 4, 5, 6],
  );
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    if (request.kind !== 'note' || !dirty || busy) {
      return;
    }
    const current = revision.current;
    const timer = setTimeout(() => {
      run(repo => repo.saveNote(noteId.current, title, description)).then(
        ok => {
          if (ok && revision.current === current) {
            setDirty(false);
            setAutosaved(true);
          }
        },
      );
    }, 700);
    return () => clearTimeout(timer);
  }, [request.kind, dirty, busy, title, description, run]);
  const edit = (setter: (value: string) => void) => (value: string) => {
    revision.current++;
    setAutosaved(false);
    setDirty(true);
    setter(value);
  };
  const exit = () => {
    if (!dirty) {
      close();
      return;
    }
    Alert.alert(t('unsaved'), t('unsavedBody'), [
      { text: t('keepEditing'), style: 'cancel' },
      { text: t('discard'), style: 'destructive', onPress: close },
    ]);
  };
  const save = async () => {
    setError('');
    let dueDate = null;
    try {
      if (date.trim()) {
        dueDate = localDate(date.trim());
      }
    } catch {
      setError(t('invalidDate'));
      return;
    }
    const ok = await run(repo => {
      if (request.kind === 'task') {
        return repo.saveTask(
          {
            id: original?.id || '',
            title,
            description,
            dueDate,
            priority,
            goalId,
            recurrence,
          },
          subtasks
            .split('\n')
            .map(value => value.trim())
            .filter(Boolean),
        );
      }
      if (request.kind === 'goal') {
        return repo.saveGoal(
          original?.id || null,
          title,
          description,
          milestones
            .split('\n')
            .map(s => s.trim())
            .filter(Boolean),
        );
      }
      if (request.kind === 'habit') {
        return repo.saveHabit(
          original?.id || null,
          title,
          description,
          weekdays,
        );
      }
      return repo.saveNote(noteId.current, title, description);
    });
    if (ok) {
      close();
    }
  };
  const heading =
    request.kind === 'task'
      ? original
        ? 'editTask'
        : 'addTask'
      : request.kind === 'goal'
      ? original
        ? 'editGoal'
        : 'addGoal'
      : request.kind === 'habit'
      ? original
        ? 'editHabit'
        : 'addHabit'
      : original
      ? 'editNote'
      : 'addNote';
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ] as const;
  return (
    <Modal
      visible
      animationType={reducedMotion ? 'none' : 'slide'}
      onRequestClose={exit}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.page}
        >
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Label size={26} bold>
                {t(heading)}
              </Label>
            </View>
            <Button secondary label={t('cancel')} onPress={exit} />
          </View>
          <Field
            label={t('title')}
            value={title}
            onChangeText={edit(setTitle)}
            autoFocus
            maxLength={500}
          />
          <Field
            label={t(request.kind === 'note' ? 'body' : 'description')}
            value={description}
            onChangeText={edit(setDescription)}
            multiline
          />
          {request.kind === 'task' && (
            <>
              <Field
                label={t('dueDate')}
                value={date}
                onChangeText={edit(setDate)}
                autoCapitalize="none"
                maxLength={10}
              />
              <Label bold>{t('repeatRule')}</Label>
              <View style={styles.row}>
                {(['none', 'daily', 'weekly', 'monthly'] as const).map(rule => (
                  <Button
                    key={rule}
                    secondary
                    selected={recurrence === rule}
                    label={t(
                      rule === 'none'
                        ? 'noRepeat'
                        : rule === 'weekly'
                        ? 'weeklyRepeat'
                        : rule,
                    )}
                    onPress={() => {
                      setRecurrence(rule);
                      setDirty(true);
                    }}
                  />
                ))}
              </View>
              <Label muted>{t('repeatHint')}</Label>
              <Field
                label={t('subtasks')}
                value={subtasks}
                onChangeText={edit(setSubtasks)}
                multiline
              />
              <Label bold>{t('priority')}</Label>
              <View style={styles.row}>
                {(['normal', 'important', 'high'] as const).map(
                  (key, index) => (
                    <Button
                      key={key}
                      secondary
                      selected={priority === index}
                      label={t(key)}
                      onPress={() => {
                        setPriority(index);
                        setDirty(true);
                      }}
                    />
                  ),
                )}
              </View>
              <Label bold>{t('goalLink')}</Label>
              <View style={styles.row}>
                <Button
                  label={t('none')}
                  secondary
                  selected={goalId === null}
                  onPress={() => {
                    setGoalId(null);
                    setDirty(true);
                  }}
                />
                {data.goals
                  .filter(g => !g.archived)
                  .map(g => (
                    <Button
                      key={g.id}
                      label={g.title}
                      secondary
                      selected={goalId === g.id}
                      onPress={() => {
                        setGoalId(g.id);
                        setDirty(true);
                      }}
                    />
                  ))}
              </View>
            </>
          )}
          {request.kind === 'goal' && (
            <Field
              label={t('milestones')}
              value={milestones}
              onChangeText={edit(setMilestones)}
              multiline
            />
          )}
          {request.kind === 'habit' && (
            <>
              <Label bold>{t('schedule')}</Label>
              <View style={styles.row}>
                {days.map((key, index) => (
                  <Button
                    key={key}
                    secondary
                    selected={weekdays.includes(index)}
                    label={t(key)}
                    onPress={() => {
                      setWeekdays(current =>
                        current.includes(index)
                          ? current.filter(n => n !== index)
                          : [...current, index],
                      );
                      setDirty(true);
                    }}
                  />
                ))}
              </View>
            </>
          )}
          {error ? <Label>{error}</Label> : null}
          {autosaved && <Label muted>{t('noteSaved')}</Label>}
          <Button label={t('save')} onPress={save} disabled={busy} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
