import { StyleSheet, Text, type TextProps } from 'react-native';
import { FontFamily, FontSize, LineHeight, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type AppTextProps = TextProps & {
  variant?:
    | 'display' // Fraunces, large — hero headlines
    | 'title' // Fraunces, medium — screen/section titles
    | 'subtitle' // Fraunces, small — card titles
    | 'body' // Manrope regular — default body copy
    | 'bodyMedium'
    | 'bodySemiBold'
    | 'caption' // Manrope, small, secondary color
    | 'label' // Manrope, small, semibold, uppercase-tracked — form labels/eyebrows
    | 'mono'; // JetBrains Mono — prices, timestamps, codes
  color?: ThemeColor;
};

/**
 * The single text primitive used across the app instead of raw <Text>, so
 * every piece of copy is guaranteed to use one of our type scale steps and
 * theme-aware colors rather than ad hoc font sizes creeping in screen by
 * screen.
 */
export function AppText({ style, variant = 'body', color, ...rest }: AppTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[{ color: theme[color ?? 'text'] }, styles[variant], style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  display: {
    fontFamily: FontFamily.display,
    fontSize: FontSize['4xl'],
    lineHeight: LineHeight['4xl'],
  },
  title: {
    fontFamily: FontFamily.display,
    fontSize: FontSize['2xl'],
    lineHeight: LineHeight['2xl'],
  },
  subtitle: {
    fontFamily: FontFamily.displayMedium,
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
  },
  body: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
  },
  bodyMedium: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
  },
  bodySemiBold: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
  },
  caption: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
  },
  label: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  mono: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
  },
});
