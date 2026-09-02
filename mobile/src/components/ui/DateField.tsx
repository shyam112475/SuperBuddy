import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { AppText } from './AppText';
import { Button } from './Button';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function DateField({
  label,
  value,
  onChange,
  maximumDate,
}: {
  label: string;
  /** ISO date string ("YYYY-MM-DD") or empty string for unset. */
  value: string;
  onChange: (isoDate: string) => void;
  maximumDate?: Date;
}) {
  const theme = useTheme();
  const [showIOSPicker, setShowIOSPicker] = useState(false);

  const dateValue = value ? new Date(value) : new Date(2000, 0, 1);

  function openPicker() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: dateValue,
        mode: 'date',
        maximumDate,
        onChange: (_event, selectedDate) => {
          if (selectedDate) onChange(selectedDate.toISOString().slice(0, 10));
        },
      });
    } else {
      setShowIOSPicker(true);
    }
  }

  return (
    <View style={styles.container}>
      <AppText variant="label" color="textSecondary" style={styles.label}>
        {label}
      </AppText>
      <Pressable
        onPress={openPicker}
        style={[styles.field, { borderColor: theme.border, backgroundColor: theme.surface }]}
      >
        <AppText variant="body" color={value ? 'text' : 'textTertiary'}>
          {value || 'Select date'}
        </AppText>
      </Pressable>

      {showIOSPicker && Platform.OS === 'ios' && (
        <View style={[styles.iosPickerWrap, { borderColor: theme.border }]}>
          <DateTimePicker
            value={dateValue}
            mode="date"
            display="spinner"
            maximumDate={maximumDate}
            onValueChange={(_event, date) => date && onChange(date.toISOString().slice(0, 10))}
          />
          <Button label="Done" size="sm" onPress={() => setShowIOSPicker(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    marginLeft: Spacing.xs,
  },
  field: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  iosPickerWrap: {
    marginTop: Spacing.xs,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    alignItems: 'center',
    paddingBottom: Spacing.md,
  },
});
