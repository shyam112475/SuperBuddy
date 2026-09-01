import { useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AppText } from './AppText';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  style?: PressableProps['style'];
};

/**
 * The one button primitive for the whole app. Press feedback is a small
 * scale-down + haptic tick rather than the usual opacity dim — reads as
 * more tactile/native and reinforces the "real, physical activity" feel
 * the rest of the design leans into.
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  onPressIn,
  onPressOut,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPressIn']>>[0]) => {
      scale.value = withTiming(0.96, { duration: 90 });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPressIn?.(e);
    },
    [scale, onPressIn]
  );

  const handlePressOut = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPressOut']>>[0]) => {
      scale.value = withTiming(1, { duration: 120 });
      onPressOut?.(e);
    },
    [scale, onPressOut]
  );

  const isDisabled = disabled || loading;

  const variantStyle = {
    primary: { backgroundColor: theme.ink, borderColor: theme.ink },
    accent: { backgroundColor: theme.coral, borderColor: theme.coral },
    secondary: { backgroundColor: 'transparent', borderColor: theme.borderStrong },
    ghost: { backgroundColor: 'transparent', borderColor: 'transparent' },
    danger: { backgroundColor: theme.danger, borderColor: theme.danger },
  }[variant];

  const textColor = {
    primary: theme.textOnInk,
    accent: theme.textOnCoral,
    secondary: theme.text,
    ghost: theme.ink,
    danger: '#FFFFFF',
  }[variant];

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.base,
        sizeStyles[size],
        variantStyle,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        animatedStyle,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <AppText variant="bodySemiBold" style={{ color: textColor }}>
          {label}
        </AppText>
      )}
    </AnimatedPressable>
  );
}

const sizeStyles = StyleSheet.create({
  sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg },
  md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
  lg: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing['2xl'] },
});

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.5,
  },
});
