import React, { useState } from 'react';
import { Alert, Share } from 'react-native';
import { useApp } from '../../app/store';
import { makeBackup, parseBackup, type Backup } from '../../data/backup';
import { Button, Card, Field, Label, useUi } from '../../ui/kit';
export function BackupPanel() {
  const { t } = useUi();
  const { data, run, busy } = useApp();
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState<Backup | null>(null);
  const [invalid, setInvalid] = useState(false);
  const validate = () => {
    try {
      setPreview(parseBackup(input));
      setInvalid(false);
    } catch {
      setPreview(null);
      setInvalid(true);
    }
  };
  const restore = () =>
    Alert.alert(t('restoreConfirm'), t('restoreWarning'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('restore'),
        style: 'destructive',
        onPress: async () => {
          if (await run(r => r.restoreBackup(input))) {
            setInput('');
            setPreview(null);
          }
        },
      },
    ]);
  return (
    <>
      <Label muted>{t('backupInfo')}</Label>
      <Button
        label={t('exportData')}
        onPress={() => {
          Share.share({ message: makeBackup(data), title: 'ORBIA' }).catch(() =>
            Alert.alert(t('error'), t('storageError')),
          );
        }}
      />
      <Field
        label={t('importData')}
        value={input}
        onChangeText={value => {
          setInput(value);
          setPreview(null);
          setInvalid(false);
        }}
        multiline
        maxLength={10000000}
      />
      <Button
        secondary
        label={t('previewRestore')}
        onPress={validate}
        disabled={!input.trim() || busy}
      />
      {invalid && <Label>{t('invalidBackup')}</Label>}
      {preview && (
        <Card>
          <Label bold>{t('previewRestore')}</Label>
          <Label>
            {t('tasks')}: {preview.data.tasks.length}
          </Label>
          <Label>
            {t('goals')}: {preview.data.goals.length}
          </Label>
          <Label>
            {t('habits')}: {preview.data.habits.length}
          </Label>
          <Label>
            {t('notes')}: {preview.data.notes.length}
          </Label>
          <Label muted>{t('restoreWarning')}</Label>
          <Button label={t('restore')} disabled={busy} onPress={restore} />
        </Card>
      )}
    </>
  );
}
