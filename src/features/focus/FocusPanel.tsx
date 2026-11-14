import React, { useEffect, useRef, useState } from 'react';
import { AppState, View } from 'react-native';
import { FocusClock } from '../../domain/focus';
import type { FocusSession } from '../../domain/models';
import { useApp } from '../../app/store';
import {
  Button,
  Card,
  Field,
  Label,
  Section,
  styles,
  useUi,
} from '../../ui/kit';
export function FocusPanel() {
  const { data, run, busy } = useApp();
  const { t, language } = useUi();
  const recovered = data.focusSessions.find(
    s => s.state === 'running' || s.state === 'paused',
  );
  const session = useRef<FocusSession | null>(recovered || null);
  const clock = useRef<FocusClock | null>(
    recovered
      ? new FocusClock(
          recovered.durationSeconds,
          () => performance.now(),
          recovered.verifiedSeconds,
        )
      : null,
  );
  const [minutes, setMinutes] = useState('25');
  const [, render] = useState(0);
  const save = async (state: FocusSession['state']) => {
    if (!session.current || !clock.current) {
      return;
    }
    session.current = {
      ...session.current,
      state,
      verifiedSeconds: Math.floor(clock.current.seconds),
      updatedAt: new Date().toISOString(),
    };
    await run(r => r.saveFocus(session.current!));
    render(n => n + 1);
  };
  const checkpoint = useRef(save);
  checkpoint.current = save;
  useEffect(() => {
    let ticks = 0;
    const timer = setInterval(() => {
      render(n => n + 1);
      ticks++;
      if (clock.current?.state === 'running' && ticks % 10 === 0) {
        checkpoint.current('running');
      }
      if (
        clock.current?.state === 'running' &&
        clock.current.seconds >= clock.current.durationSeconds
      ) {
        clock.current.finish();
        checkpoint.current('finished');
      }
    }, 1000);
    const lifecycle = AppState.addEventListener('change', state => {
      if (state !== 'active' && clock.current?.state === 'running') {
        checkpoint.current('running');
      }
    });
    return () => {
      clearInterval(timer);
      lifecycle.remove();
      if (clock.current?.state === 'running') {
        clock.current.pause();
        checkpoint.current('paused');
      }
    };
  }, []);
  const start = async () => {
    if (
      !clock.current ||
      clock.current.state === 'finished' ||
      session.current?.state === 'cancelled'
    ) {
      const duration = Number(minutes) * 60;
      if (!Number.isInteger(duration) || duration < 60 || duration > 14400) {
        return;
      }
      clock.current = new FocusClock(duration);
      const timestamp = new Date().toISOString();
      session.current = {
        id: `focus-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        durationSeconds: duration,
        verifiedSeconds: 0,
        state: 'paused',
        createdAt: timestamp,
        updatedAt: timestamp,
      };
    }
    clock.current.start();
    await save('running');
  };
  const remaining = Math.max(
    0,
    Math.ceil(
      (clock.current?.durationSeconds || Number(minutes) * 60 || 0) -
        (clock.current?.seconds || 0),
    ),
  );
  const active =
    clock.current &&
    clock.current.state !== 'finished' &&
    session.current?.state !== 'cancelled';
  return (
    <>
      <Label muted>{t('focusInfo')}</Label>
      <Field
        label={t('duration')}
        keyboardType="number-pad"
        value={minutes}
        onChangeText={setMinutes}
        editable={!active}
      />
      <Card>
        <Label
          size={48}
          bold
          style={{ textAlign: 'center', fontVariant: ['tabular-nums'] }}
        >
          {String(Math.floor(remaining / 60)).padStart(2, '0')}:
          {String(remaining % 60).padStart(2, '0')}
        </Label>
        <View style={styles.row}>
          {clock.current?.state === 'running' ? (
            <Button
              label={t('pause')}
              disabled={busy}
              onPress={() => {
                clock.current?.pause();
                save('paused');
              }}
            />
          ) : (
            <Button
              label={t(active ? 'resume' : 'startFocus')}
              disabled={
                busy ||
                !Number.isInteger(Number(minutes)) ||
                Number(minutes) < 1 ||
                Number(minutes) > 240
              }
              onPress={start}
            />
          )}
          {active && (
            <>
              <Button
                secondary
                label={t('finish')}
                disabled={busy}
                onPress={() => {
                  clock.current?.finish();
                  save('finished');
                }}
              />
              <Button
                secondary
                label={t('cancel')}
                disabled={busy}
                onPress={() => {
                  clock.current?.finish();
                  save('cancelled');
                }}
              />
            </>
          )}
        </View>
      </Card>
      <Section title={t('focusHistory')}>
        {data.focusSessions
          .filter(s => s.state === 'finished')
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .map(s => (
            <Card key={s.id}>
              <Label bold>
                {new Intl.NumberFormat(language, {
                  maximumFractionDigits: 1,
                }).format(s.verifiedSeconds / 60)}{' '}
                {t('minutes')}
              </Label>
              <Label muted>
                {new Intl.DateTimeFormat(language, {
                  dateStyle: 'medium',
                }).format(new Date(s.createdAt))}
              </Label>
            </Card>
          ))}
      </Section>
    </>
  );
}
