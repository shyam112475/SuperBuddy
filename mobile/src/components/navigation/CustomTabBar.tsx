import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ComponentProps } from 'react';
import type { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { AppText } from '@/components/ui';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Derived directly from <Tabs tabBar={...}>'s own prop type rather than
// importing BottomTabBarProps from @react-navigation/bottom-tabs — that
// package is only a transitive dependency of expo-router, and installing
// it directly creates a second, slightly different copy of these types
// that don't structurally match the one expo-router actually passes in.
type TabBarRenderProp = NonNullable<ComponentProps<typeof Tabs>['tabBar']>;
type TabBarProps = Parameters<TabBarRenderProp>[0];

const TAB_ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  index: 'compass',
  bookings: 'calendar',
  messages: 'message-circle',
  profile: 'user',
};

/**
 * A floating pill tab bar rather than an edge-to-edge bar — reads as more
 * premium/considered than the default full-width bottom bar every other
 * app ships with, while staying fully themeable (unlike a native tab bar).
 */
export function CustomTabBar({ state, descriptors, navigation }: TabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + Spacing.sm }]} pointerEvents="box-none">
      <View style={[styles.bar, Shadow.lg, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const iconName = TAB_ICONS[route.name] ?? 'circle';
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : (options.title ?? route.name);

          function onPress() {
            Haptics.selectionAsync();
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          }

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tab}
            >
              <View
                style={[
                  styles.iconWrap,
                  isFocused && { backgroundColor: theme.ink },
                ]}
              >
                <Feather name={iconName} size={20} color={isFocused ? theme.textOnInk : theme.textTertiary} />
              </View>
              <AppText
                variant="caption"
                style={{
                  color: isFocused ? theme.ink : theme.textTertiary,
                  fontSize: 11,
                  marginTop: 2,
                }}
              >
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    paddingVertical: Spacing.xs,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
