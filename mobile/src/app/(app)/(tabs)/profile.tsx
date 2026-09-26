import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { AppText, AppView, Avatar, Badge, Card } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/features/auth/hooks';

function MenuRow({
  icon,
  label,
  onPress,
  destructive = false,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} style={styles.menuRow}>
      <View style={styles.menuRowLeft}>
        <Feather name={icon} size={18} color={destructive ? theme.danger : theme.textSecondary} />
        <AppText variant="bodyMedium" color={destructive ? 'danger' : 'text'}>
          {label}
        </AppText>
      </View>
      <Feather name="chevron-right" size={18} color={theme.textTertiary} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const { mutate: logout } = useLogout();

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

        <Card padded={false} style={styles.menuCard}>
          <Link href="/(app)/profile/edit" asChild>
            <MenuRow icon="user" label="Edit profile" onPress={() => {}} />
          </Link>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <Link href="/(app)/profile/settings" asChild>
            <MenuRow icon="settings" label="Account settings" onPress={() => {}} />
          </Link>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <MenuRow icon="log-out" label="Sign out" destructive onPress={() => logout()} />
        </Card>
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
  menuCard: {
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.lg,
  },
});
