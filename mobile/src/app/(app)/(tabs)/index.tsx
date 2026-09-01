import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, AppView, Badge, Card, CompanionMark } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useHealthCheck } from '@/hooks/useHealthCheck';

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError, error } = useHealthCheck();

  return (
    <AppView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.xl }]}
      >
        <View style={styles.header}>
          <CompanionMark size={32} />
          <AppText variant="title" style={styles.headerTitle}>
            Discover
          </AppText>
        </View>
        <AppText variant="body" color="textSecondary" style={styles.subtitle}>
          Verified companions for hiking, travel, events, and other real-world activities.
        </AppText>

        <Card style={styles.emptyCard}>
          <AppText variant="subtitle">Partner discovery is coming in Phase 4</AppText>
          <AppText variant="body" color="textSecondary" style={styles.emptyCardBody}>
            This screen will show search, filters, and partner cards once the discovery API is
            wired up.
          </AppText>
        </Card>

        <Card style={styles.statusCard}>
          <View style={styles.statusRow}>
            <AppText variant="label" color="textSecondary">
              Backend connection
            </AppText>
            {isLoading && <Badge label="Checking…" tone="neutral" />}
            {isError && <Badge label="Unreachable" tone="danger" />}
            {data && <Badge label="Healthy" tone="success" />}
          </View>
          {isError && (
            <AppText variant="caption" color="textTertiary" style={styles.statusDetail}>
              {error instanceof Error ? error.message : 'Unknown error'} — check EXPO_PUBLIC_API_URL
              in .env
            </AppText>
          )}
        </Card>
      </ScrollView>
    </AppView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['5xl'],
    gap: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerTitle: {},
  subtitle: {
    marginTop: -Spacing.sm,
  },
  emptyCard: {
    marginTop: Spacing.lg,
  },
  emptyCardBody: {
    marginTop: Spacing.xs,
  },
  statusCard: {},
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusDetail: {
    marginTop: Spacing.sm,
  },
});
