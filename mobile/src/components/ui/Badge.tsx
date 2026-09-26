import { StyleSheet, View, type ViewProps } from 'react-native';
import { AppText } from './AppText';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type BadgeTone = 'ink' | 'coral' | 'sand' | 'sage' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export type BadgeProps = ViewProps & {
  label: string;
  tone?: BadgeTone;
};

export function Badge({ label, tone = 'neutral', style, ...rest }: BadgeProps) {
  const theme = useTheme();
  const { bg, fg } = getToneColors(theme, tone);

  return (
    <View style={[styles.base, { backgroundColor: bg }, style]} {...rest}>
      <AppText variant="label" style={{ color: fg }}>
        {label}
      </AppText>
    </View>
  );
}

function getToneColors(theme: Record<string, string>, tone: BadgeTone) {
  switch (tone) {
    case 'ink':
      return { bg: theme.ink, fg: theme.textOnInk };
    case 'coral':
      return { bg: theme.coral, fg: theme.textOnCoral };
    case 'sand':
      return { bg: theme.sand, fg: theme.inkDeep };
    case 'sage':
      return { bg: theme.sage, fg: theme.textOnInk };
    case 'success':
      return { bg: theme.successSurface, fg: theme.success };
    case 'warning':
      return { bg: theme.warningSurface, fg: theme.warning };
    case 'danger':
      return { bg: theme.dangerSurface, fg: theme.danger };
    case 'info':
      return { bg: theme.infoSurface, fg: theme.info };
    default:
      return { bg: theme.surfaceSunken, fg: theme.textSecondary };
  }
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
});
