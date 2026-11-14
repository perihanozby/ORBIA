import React, { createContext, useContext } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { light, dark } from '../theme/tokens';
import { translate, type Language, type StringKey } from '../app/strings';

export const UiContext = createContext({
  language: 'en' as Language,
  isDark: false,
});
export function useUi() {
  const value = useContext(UiContext);
  return {
    ...value,
    c: value.isDark ? dark : light,
    t: (key: StringKey) => translate(value.language, key),
  };
}
export function Label({
  children,
  size = 15,
  muted = false,
  bold = false,
  style,
}: {
  children: React.ReactNode;
  size?: number;
  muted?: boolean;
  bold?: boolean;
  style?: object;
}) {
  const { c } = useUi();
  return (
    <Text
      style={[
        {
          color: muted ? c.secondaryText : c.text,
          fontSize: size,
          lineHeight: size * 1.45,
          fontWeight: bold ? '600' : '400',
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
export function Button({
  label,
  onPress,
  secondary = false,
  disabled = false,
  selected = false,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  selected?: boolean;
}) {
  const { c } = useUi();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: secondary
            ? selected
              ? c.secondarySurface
              : c.surface
            : c.primary,
          borderColor: c.border,
          borderWidth: secondary ? 1 : 0,
          opacity: disabled ? 0.45 : pressed ? 0.7 : 1,
        },
      ]}
    >
      <Text
        style={{
          color: secondary ? c.text : c.background,
          fontSize: 14,
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
export function Card({
  children,
  tint,
  style,
}: {
  children: React.ReactNode;
  tint?: string;
  style?: ViewStyle;
}) {
  const { c } = useUi();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: tint || c.surface, borderColor: c.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  const { c } = useUi();
  return (
    <View style={styles.field}>
      <Label muted size={13}>
        {label}
      </Label>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={c.secondaryText}
        style={[
          styles.input,
          { color: c.text, backgroundColor: c.surface, borderColor: c.border },
          props.multiline && { minHeight: 112, textAlignVertical: 'top' },
          props.style,
        ]}
      />
    </View>
  );
}
export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Label size={19} bold>
        {title}
      </Label>
      {children}
    </View>
  );
}
export function Empty({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  const { c } = useUi();
  return (
    <Card>
      <View style={styles.emptyMark}>
        <View style={[styles.orbit, { borderColor: c.primary }]} />
        <View style={[styles.dot, { backgroundColor: c.primary }]} />
      </View>
      <Label size={18} bold>
        {title}
      </Label>
      <Label muted>{body}</Label>
      {action}
    </Card>
  );
}
export function Check({
  checked,
  label,
  onPress,
}: {
  checked: boolean;
  label: string;
  onPress: () => void;
}) {
  const { c } = useUi();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      onPress={onPress}
      style={styles.checkTarget}
    >
      <View
        style={[
          styles.check,
          {
            borderColor: c.primary,
            backgroundColor: checked ? c.primary : c.surface,
          },
        ]}
      >
        {checked && (
          <Text style={{ color: c.background, fontWeight: '700' }}>✓</Text>
        )}
      </View>
    </Pressable>
  );
}
export const styles = StyleSheet.create({
  page: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 20, gap: 24 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  section: { gap: 12 },
  card: { padding: 20, borderRadius: 20, borderWidth: 1, gap: 12 },
  button: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    justifyContent: 'center',
  },
  field: { gap: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    minHeight: 52,
    fontSize: 16,
  },
  checkTarget: {
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 25,
    height: 25,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMark: {
    width: 60,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  orbit: {
    width: 40,
    height: 40,
    borderWidth: 1.5,
    borderRadius: 20,
    transform: [{ scaleX: 1.25 }, { rotate: '-25deg' }],
  },
  dot: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 5,
    right: 5,
    top: 10,
  },
});
