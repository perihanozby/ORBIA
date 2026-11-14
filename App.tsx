import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useApp } from './src/app/store';
import {
  en,
  translate,
  type Language,
  type StringKey,
} from './src/app/strings';
import { openRepository } from './src/data/nativeDatabase';
import type { Repository } from './src/data/repository';
import { light, dark } from './src/theme/tokens';
import { Icon } from './src/ui/Icon';
import { Button, Empty, Label, UiContext } from './src/ui/kit';
import {
  TodayScreen,
  TasksScreen,
  GoalsScreen,
  HabitsScreen,
  MoreScreen,
} from './src/features/workspace/Screens';
import { Editor, type EditRequest } from './src/features/editor/Editor';
import { reconcileReminders } from './src/services/reminders';
const Tabs = createBottomTabNavigator();
export default function App({ repository }: { repository?: Repository }) {
  const { data, ready, error, busy, initialize, run } = useApp();
  const [request, setRequest] = useState<EditRequest | null>(null);
  const [initialError, setInitialError] = useState(false);
  const repo = useRef<Repository | null>(repository || null);
  const scheme = useColorScheme();
  const language: Language = data.preferences.language === 'tr' ? 'tr' : 'en';
  const isDark =
    data.preferences.appearance === 'dark' ||
    (data.preferences.appearance !== 'light' && scheme === 'dark');
  const colors = isDark ? dark : light;
  const t = (key: StringKey) => translate(language, key);
  const start = useCallback(() => {
    setInitialError(false);
    try {
      if (!repo.current) {
        repo.current = openRepository();
      }
      initialize(repo.current);
    } catch {
      setInitialError(true);
    }
  }, [initialize]);
  useEffect(() => {
    start();
  }, [start]);
  useEffect(() => {
    if (!ready) {
      return;
    }
    const reconcile = () =>
      reconcileReminders(
        data.preferences.reminders === 'yes',
        language,
        data.preferences.reminderTime || '09:00',
      ).catch(() =>
        Alert.alert(
          translate(language, 'error'),
          translate(language, 'notificationError'),
        ),
      );
    reconcile();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        reconcile();
      }
    });
    return () => subscription.remove();
  }, [
    ready,
    language,
    data.preferences.reminders,
    data.preferences.reminderTime,
  ]);
  useEffect(() => {
    if (ready && error) {
      Alert.alert(
        translate(language, 'error'),
        error in en
          ? translate(language, error as StringKey)
          : translate(language, 'storageError'),
      );
    }
  }, [error, ready, language]);
  const screens = [
    { name: 'today', component: TodayScreen },
    { name: 'tasks', component: TasksScreen },
    { name: 'goals', component: GoalsScreen },
    { name: 'habits', component: HabitsScreen },
    { name: 'more', component: MoreScreen },
  ] as const;
  return (
    <UiContext.Provider value={{ language, isDark }}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <SafeAreaView
          edges={['top', 'left', 'right']}
          style={{ flex: 1, backgroundColor: colors.background }}
        >
          {!ready ? (
            <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
              <Empty
                title={t(initialError || error ? 'loadError' : 'loading')}
                body={
                  error === 'futureDatabase'
                    ? t('futureDatabase')
                    : t('tagline')
                }
                action={
                  initialError || error ? (
                    <Button
                      label={t('retry')}
                      disabled={busy}
                      onPress={start}
                    />
                  ) : undefined
                }
              />
            </View>
          ) : data.preferences.onboarded !== 'yes' ? (
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                padding: 24,
                gap: 28,
              }}
            >
              <Label size={42} bold>
                ORBIA
              </Label>
              <Label size={30} bold>
                {t('welcome')}
              </Label>
              <Label size={17} muted>
                {t('welcomeBody')}
              </Label>
              <Button
                label={t('start')}
                disabled={busy}
                onPress={() => {
                  run(r => r.preference('onboarded', 'yes'));
                }}
              />
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Button
                  secondary
                  label="English"
                  onPress={() => {
                    run(r => r.preference('language', 'en'));
                  }}
                />
                <Button
                  secondary
                  label={t('turkishName')}
                  onPress={() => {
                    run(r => r.preference('language', 'tr'));
                  }}
                />
              </View>
            </ScrollView>
          ) : (
            <NavigationContainer
              theme={{
                ...(isDark ? DarkTheme : DefaultTheme),
                colors: {
                  ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
                  primary: colors.primary,
                  background: colors.background,
                  card: colors.surface,
                  text: colors.text,
                  border: colors.border,
                },
              }}
            >
              <Tabs.Navigator
                backBehavior="history"
                screenOptions={{
                  headerShown: false,
                  animation: 'none',
                  tabBarActiveTintColor: colors.primary,
                  tabBarInactiveTintColor: colors.secondaryText,
                  tabBarStyle: {
                    backgroundColor: colors.surface,
                    minHeight: 72,
                  },
                  tabBarLabelStyle: { fontSize: 12, marginBottom: 8 },
                }}
              >
                {screens.map(({ name, component: Screen }) => (
                  <Tabs.Screen
                    key={name}
                    name={name}
                    options={{
                      title: t(name),
                      tabBarIcon: ({ color }) => (
                        <Icon name={name} color={color} />
                      ),
                    }}
                  >
                    {() => <Screen open={setRequest} />}
                  </Tabs.Screen>
                ))}
              </Tabs.Navigator>
            </NavigationContainer>
          )}
          {request && (
            <Editor request={request} close={() => setRequest(null)} />
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    </UiContext.Provider>
  );
}
