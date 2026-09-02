import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AxiosError } from 'axios';
import { AppText, AppView, Button, TextField } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useChangePassword, useDeleteAccount } from '@/features/users/hooks';
import { changePasswordFormSchema, type ChangePasswordFormValues } from '@/features/users/schemas';

function ChangePasswordSection() {
  const { mutate, isPending, error } = useChangePassword();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordFormSchema) });

  const apiError = error as AxiosError<{ message: string }> | null;

  function onSubmit(values: ChangePasswordFormValues) {
    mutate({ currentPassword: values.currentPassword, newPassword: values.newPassword });
  }

  return (
    <View style={styles.section}>
      <AppText variant="subtitle">Change password</AppText>
      <AppText variant="caption" color="textTertiary" style={styles.sectionHint}>
        You&apos;ll be signed out of all devices after changing your password.
      </AppText>

      <View style={styles.form}>
        <Controller
          control={control}
          name="currentPassword"
          render={({ field }) => (
            <TextField
              label="Current password"
              value={field.value}
              onChangeText={field.onChange}
              secureTextEntry
              error={errors.currentPassword?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="newPassword"
          render={({ field }) => (
            <TextField
              label="New password"
              value={field.value}
              onChangeText={field.onChange}
              secureTextEntry
              error={errors.newPassword?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <TextField
              label="Confirm new password"
              value={field.value}
              onChangeText={field.onChange}
              secureTextEntry
              error={errors.confirmPassword?.message}
            />
          )}
        />

        {apiError && (
          <AppText variant="caption" color="danger">
            {apiError.response?.data?.message ?? 'Something went wrong. Please try again.'}
          </AppText>
        )}

        <Button label="Change password" loading={isPending} onPress={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
}

function DeleteAccountSection() {
  const [confirming, setConfirming] = useState(false);
  const { mutate, isPending } = useDeleteAccount();

  return (
    <View style={styles.section}>
      <AppText variant="subtitle" color="danger">
        Delete account
      </AppText>
      <AppText variant="caption" color="textTertiary" style={styles.sectionHint}>
        This deactivates your account and signs you out everywhere. This can&apos;t be undone from
        the app — contact support if you change your mind.
      </AppText>

      {!confirming ? (
        <Button
          label="Delete my account"
          variant="secondary"
          onPress={() => setConfirming(true)}
          style={styles.deleteButton}
        />
      ) : (
        <View style={styles.confirmRow}>
          <Button
            label="Yes, permanently delete"
            variant="danger"
            loading={isPending}
            onPress={() => mutate()}
          />
          <Button label="Cancel" variant="ghost" onPress={() => setConfirming(false)} />
        </View>
      )}
    </View>
  );
}

export default function AccountSettingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing['3xl'] },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <AppText variant="title">Account settings</AppText>

          <ChangePasswordSection />
          <DeleteAccountSection />
        </ScrollView>
      </AppView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing['2xl'],
    flexGrow: 1,
  },
  section: {
    marginTop: Spacing['2xl'],
    paddingTop: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#00000015',
  },
  sectionHint: {
    marginTop: Spacing.xs,
  },
  form: {
    gap: Spacing.lg,
    marginTop: Spacing.lg,
  },
  deleteButton: {
    marginTop: Spacing.lg,
    alignSelf: 'flex-start',
  },
  confirmRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
});
