import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import { TextInput } from 'react-native';
import { testDatabase } from '../test-utils/database';
import { useApp } from '../src/app/store';
import { Editor } from '../src/features/editor/Editor';
test('note autosave keeps a stable ID across edits', async () => {
  jest.useFakeTimers();
  const db = testDatabase();
  let tree: Renderer.ReactTestRenderer | undefined;
  try {
    await useApp.getState().initialize(db.repository);
    await act(async () => {
      tree = Renderer.create(
        <Editor request={{ kind: 'note' }} close={jest.fn()} />,
      );
    });
    await act(async () => {
      const fields = tree!.root.findAllByType(TextInput);
      fields[0].props.onChangeText('Quiet thoughts');
      fields[1].props.onChangeText('First thought');
    });
    await act(async () => {
      await jest.advanceTimersByTimeAsync(750);
    });
    const first = await db.repository.snapshot();
    expect(first.notes).toHaveLength(1);
    await act(async () => {
      tree!.root
        .findAllByType(TextInput)[1]
        .props.onChangeText('A little more clarity');
    });
    await act(async () => {
      await jest.advanceTimersByTimeAsync(750);
    });
    const second = await db.repository.snapshot();
    expect(second.notes).toHaveLength(1);
    expect(second.notes[0].id).toBe(first.notes[0].id);
    expect(second.notes[0].body).toBe('A little more clarity');
  } finally {
    if (tree) {
      await act(async () => tree!.unmount());
    }
    db.close();
    jest.useRealTimers();
  }
});
