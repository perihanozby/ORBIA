import notifee, {
  AuthorizationStatus,
  RepeatFrequency,
  TriggerType,
} from '@notifee/react-native';
import { translate, type Language } from '../app/strings';
const reminderId = 'orbia-daily';
export async function enableReminders(
  language: Language,
  time: string,
): Promise<boolean> {
  const permission = await notifee.requestPermission();
  if (permission.authorizationStatus < AuthorizationStatus.AUTHORIZED) {
    return false;
  }
  await reconcileReminders(true, language, time);
  return true;
}
export async function reconcileReminders(
  enabled: boolean,
  language: Language,
  time: string,
) {
  await notifee.cancelNotification(reminderId);
  if (!enabled) {
    return;
  }
  const permission = await notifee.getNotificationSettings();
  if (permission.authorizationStatus < AuthorizationStatus.AUTHORIZED) {
    return;
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    throw new Error('invalidTime');
  }
  const channelId = await notifee.createChannel({
    id: 'daily-rhythm',
    name: translate(language, 'dailyReminder'),
  });
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  if (date.getTime() <= Date.now()) {
    date.setDate(date.getDate() + 1);
  }
  // WorkManager-backed inexact scheduling: no exact alarm permission requested.
  await notifee.createTriggerNotification(
    {
      id: reminderId,
      title: 'ORBIA',
      body: translate(language, 'tagline'),
      android: {
        channelId,
        smallIcon: 'ic_notification',
        pressAction: { id: 'default' },
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    },
  );
}
