import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, AppView, Avatar, Badge, Button, Card } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/features/auth/hooks';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  if (!user) return null;

  return (
    <AppView style={{ flex: 1 }}>
      <View style={[styles.content, { paddingTop: insets.top + Spacing.xl }]}>
        <AppText variant="title">Profile</AppText>

        <Card style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Avatar uri={user.profileImage} name={user.fullName} size={56} />
            <View style={styles.profileInfo}>
              <AppText variant="subtitle">{user.fullName}</AppText>
              <AppText variant="caption" color="textSecondary">
                {user.email}
              </AppText>
            </View>
          </View>
          <View style={styles.badges}>
            <Badge
              label={user.verificationStatus === 'VERIFIED' ? 'Verified' : user.verificationStatus}
              tone={user.verificationStatus === 'VERIFIED' ? 'sage' : 'neutral'}
            />
            <Badge label={user.role} tone="ink" />
          </View>
        </Card>

        <Button
          label="Sign out"
          variant="secondary"
          loading={isLoggingOut}
          onPress={() => logout()}
          style={styles.signOutButton}
        />
      </View>
    </AppView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    gap: Spacing.lg,
  },
  profileCard: {
    marginTop: Spacing.lg,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  signOutButton: {
    marginTop: Spacing.sm,
  },
});
