import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface PillOption<T extends string> {
  value: T;
  label: string;
}

export function PillSelector<T extends string>({
  options,
  value,
  onChange,
}: {
  options: PillOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
}) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.pill,
              {
                backgroundColor: selected ? theme.ink : theme.surfaceSunken,
                borderColor: selected ? theme.ink : theme.border,
              },
            ]}
          >
            <AppText variant="caption" style={{ color: selected ? theme.textOnInk : theme.textSecondary }}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  pill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
  },
});
