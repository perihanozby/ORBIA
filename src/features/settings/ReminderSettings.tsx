import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { useApp } from '../../app/store';
import { enableReminders, reconcileReminders } from '../../services/reminders';
import { Button, Field, Label, styles, useUi } from '../../ui/kit';
export function ReminderSettings() {
  const { data, run } = useApp();
  const { t, language } = useUi();
  const [time, setTime] = useState(data.preferences.reminderTime || '09:00');
  const enabled = data.preferences.reminders === 'yes';
  const enable = async () => {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      Alert.alert(t('error'), t('invalidTime'));
      return;
    }
    try {
      if (!(await enableReminders(language, time))) {
        Alert.alert(t('error'), t('permissionDenied'));
        return;
      }
      const saved = await run(async repo => {
        await repo.preference('reminderTime', time);
        await repo.preference('reminders', 'yes');
      });
      if (!saved) {
        await reconcileReminders(false, language, time);
      }
    } catch {
      Alert.alert(t('error'), t('notificationError'));
    }
  };
  const disable = async () => {
    try {
      await reconcileReminders(false, language, time);
      await run(r => r.preference('reminders', 'no'));
    } catch {
      Alert.alert(t('error'), t('notificationError'));
    }
  };
  return (
    <>
      <Label bold>{t('dailyReminder')}</Label>
      <Label muted>{t('reminderInfo')}</Label>
      <Field
        label={t('reminderTime')}
        value={time}
        onChangeText={setTime}
        maxLength={5}
        keyboardType="numbers-and-punctuation"
      />
      <View style={styles.row}>
        <Button
          secondary
          selected={enabled}
          label={t('enableReminder')}
          onPress={enable}
        />
        <Button
          secondary
          selected={!enabled}
          label={t('disableReminder')}
          onPress={disable}
        />
      </View>
    </>
  );
}
