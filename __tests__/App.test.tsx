/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import { testDatabase } from '../test-utils/database';
import { useApp } from '../src/app/store';
import { Button } from '../src/ui/kit';
import { TextInput } from 'react-native';
import { Editor } from '../src/features/editor/Editor';
import { TaskCard } from '../src/features/workspace/Screens';
import { calendarDate } from '../src/domain/models';
import { translate, en, tr } from '../src/app/strings';

test('onboarding opens the actual Today dashboard with real empty data', async () => {
  const db = testDatabase();
  let tree: ReactTestRenderer.ReactTestRenderer;
  try {
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(<App repository={db.repository} />);
    });
    const button = tree!.root
      .findAllByType(Button)
      .find(node => node.props.label === 'Get started')!;
    await ReactTestRenderer.act(async () => {
      await button.props.onPress();
    });
    expect(useApp.getState().data.preferences.onboarded).toBe('yes');
    expect(JSON.stringify(tree!.toJSON())).toContain('YOUR TODAY COMPASS');
    await ReactTestRenderer.act(async () => {
      tree!.unmount();
    });
  } finally {
    db.close();
  }
});

test('task editor writes SQLite and completion can be undone', async () => {
  const db = testDatabase();
  let tree: ReactTestRenderer.ReactTestRenderer;
  const close = jest.fn();
  try {
    await useApp.getState().initialize(db.repository);
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <Editor
          request={{ kind: 'task', date: calendarDate() }}
          close={close}
        />,
      );
    });
    await ReactTestRenderer.act(async () => {
      tree!.root
        .findAllByType(TextInput)[0]
        .props.onChangeText('A meaningful step');
    });
    await ReactTestRenderer.act(async () => {
      await tree!.root
        .findAllByType(Button)
        .find(node => node.props.label === 'Save')!
        .props.onPress();
    });
    expect(close).toHaveBeenCalled();
    const task = (await db.repository.snapshot()).tasks[0];
    expect(task.title).toBe('A meaningful step');
    await ReactTestRenderer.act(async () => {
      tree!.update(<TaskCard task={task} open={jest.fn()} />);
    });
    const checkbox = tree!.root.findAll(
      node => node.props.accessibilityRole === 'checkbox',
    )[0];
    await ReactTestRenderer.act(async () => {
      await checkbox.props.onPress();
    });
    // The action is persisted before the state snapshot refresh completes.
    await ReactTestRenderer.act(async () => {
      await new Promise(resolve => setImmediate(resolve));
    });
    expect(
      (await db.repository.snapshot()).tasks[0].completedAt,
    ).not.toBeNull();
    await db.repository.completeTask(task.id, false);
    expect((await db.repository.snapshot()).tasks[0].completedAt).toBeNull();
    await ReactTestRenderer.act(async () => {
      tree!.unmount();
    });
  } finally {
    db.close();
  }
});

test('goal and habit editors persist real data and English/Turkish keys stay aligned', async () => {
  const db = testDatabase();
  let tree: ReactTestRenderer.ReactTestRenderer;
  try {
    await useApp.getState().initialize(db.repository);
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <Editor request={{ kind: 'goal' }} close={jest.fn()} />,
      );
    });
    await ReactTestRenderer.act(async () => {
      const inputs = tree!.root.findAllByType(TextInput);
      inputs[0].props.onChangeText('Learn Turkish');
      inputs[2].props.onChangeText('Read one chapter\nWrite a paragraph');
    });
    await ReactTestRenderer.act(async () => {
      await tree!.root
        .findAllByType(Button)
        .find(n => n.props.label === 'Save')!
        .props.onPress();
    });
    expect((await db.repository.snapshot()).milestones).toHaveLength(2);
    await ReactTestRenderer.act(async () => {
      tree!.unmount();
      tree = ReactTestRenderer.create(
        <Editor request={{ kind: 'habit' }} close={jest.fn()} />,
      );
    });
    await ReactTestRenderer.act(async () => {
      tree!.root
        .findAllByType(TextInput)[0]
        .props.onChangeText('Read every day');
    });
    await ReactTestRenderer.act(async () => {
      await tree!.root
        .findAllByType(Button)
        .find(n => n.props.label === 'Save')!
        .props.onPress();
    });
    const habit = (await db.repository.snapshot()).habits[0];
    await db.repository.trackHabit(habit.id, calendarDate(), 'complete');
    expect((await db.repository.snapshot()).occurrences).toHaveLength(1);
    expect(Object.keys(tr).sort()).toEqual(Object.keys(en).sort());
    expect(translate('tr', 'tasks')).toBe('Görevler');
    await ReactTestRenderer.act(async () => {
      tree!.unmount();
    });
  } finally {
    db.close();
  }
});
