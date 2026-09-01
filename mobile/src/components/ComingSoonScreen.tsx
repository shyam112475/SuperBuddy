import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, AppView, CompanionMark } from '@/components/ui';
import { Spacing } from '@/constants/theme';

export function ComingSoonScreen({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase: string;
}) {
  const insets = useSafeAreaInsets();

  return (
    <AppView style={{ flex: 1 }}>
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <CompanionMark size={48} monochrome />
        <AppText variant="title" style={styles.title}>
          {title}
        </AppText>
        <AppText variant="body" color="textSecondary" style={styles.description}>
          {description}
        </AppText>
        <AppText variant="label" color="textTertiary" style={styles.phase}>
          {phase}
        </AppText>
      </View>
    </AppView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['3xl'],
  },
  title: {
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  description: {
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  phase: {
    marginTop: Spacing.xl,
  },
});
