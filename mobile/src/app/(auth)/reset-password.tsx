import { useState } from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AxiosError } from 'axios';
import { AppText, AppView, Button, TextField } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { authApi } from '@/features/auth/authApi';
import { resetPasswordFormSchema, type ResetPasswordFormValues } from '@/features/auth/schemas';

export default function ResetPasswordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordFormSchema) });

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) return;
    setApiError(null);
    setIsSubmitting(true);
    try {
      await authApi.resetPassword(token, values.newPassword);
      setIsSuccess(true);
      setTimeout(() => router.replace('/(auth)/login'), 1500);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setApiError(axiosErr.response?.data?.message ?? 'This link may have expired. Please request a new one.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <AppView style={{ flex: 1 }}>
        <View style={[styles.content, styles.centered, { paddingTop: insets.top }]}>
          <AppText variant="body" color="danger" style={styles.centerText}>
            This reset link is missing or invalid. Please request a new one.
          </AppText>
          <Link href="/(auth)/forgot-password" asChild>
            <AppText variant="bodySemiBold" color="ink" style={styles.linkSpacing}>
              Request a new link
            </AppText>
          </Link>
        </View>
      </AppView>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing['2xl'] }]}
          keyboardShouldPersistTaps="handled"
        >
          <AppText variant="title">Set a new password</AppText>

          {isSuccess ? (
            <AppText variant="body" color="success" style={styles.successText}>
              Password reset. Taking you to sign in…
            </AppText>
          ) : (
            <View style={styles.form}>
              <Controller
                control={control}
                name="newPassword"
                render={({ field }) => (
                  <TextField
                    label="New password"
                    secureTextEntry
                    value={field.value}
                    onChangeText={field.onChange}
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
                    secureTextEntry
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.confirmPassword?.message}
                  />
                )}
              />

              {apiError && (
                <AppText variant="caption" color="danger">
                  {apiError}
                </AppText>
              )}

              <Button
                label="Reset password"
                fullWidth
                size="lg"
                loading={isSubmitting}
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          )}
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  linkSpacing: {
    marginTop: Spacing.lg,
  },
  successText: {
    marginTop: Spacing['2xl'],
  },
  form: {
    gap: Spacing.lg,
    marginTop: Spacing['2xl'],
  },
});
