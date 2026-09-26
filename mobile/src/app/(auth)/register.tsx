import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AxiosError } from 'axios';
import { AppText, AppView, Button, TextField } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useRegister } from '@/features/auth/hooks';
import { registerFormSchema, type RegisterFormValues } from '@/features/auth/schemas';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { mutate, isPending, error } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerFormSchema) });

  const apiError = error as AxiosError<{ message: string }> | null;

  function onSubmit(values: RegisterFormValues) {
    mutate({ ...values, phoneNumber: values.phoneNumber || undefined });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + Spacing['2xl'], paddingBottom: insets.bottom + Spacing['2xl'] },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <AppText variant="title">Create your account</AppText>
          <AppText variant="body" color="textSecondary" style={styles.subtitle}>
            Join CompanionHub to find or offer non-sexual companionship and activities.
          </AppText>

          <View style={styles.form}>
            <Controller
              control={control}
              name="fullName"
              render={({ field }) => (
                <TextField
                  label="Full name"
                  value={field.value}
                  onChangeText={field.onChange}
                  autoComplete="name"
                  error={errors.fullName?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <TextField
                  label="Email"
                  value={field.value}
                  onChangeText={field.onChange}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field }) => (
                <TextField
                  label="Phone number (optional)"
                  value={field.value}
                  onChangeText={field.onChange}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  error={errors.phoneNumber?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <TextField
                  label="Password"
                  value={field.value}
                  onChangeText={field.onChange}
                  secureTextEntry
                  autoComplete="password-new"
                  error={errors.password?.message}
                />
              )}
            />

            <AppText variant="caption" color="textTertiary">
              By signing up you agree that CompanionHub is for non-sexual companionship and
              activities only.
            </AppText>

            {apiError && (
              <AppText variant="caption" color="danger">
                {apiError.response?.data?.message ?? 'Something went wrong. Please try again.'}
              </AppText>
            )}

            <Button
              label="Create account"
              fullWidth
              size="lg"
              loading={isPending}
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButton}
            />
          </View>

          <View style={styles.footer}>
            <AppText variant="body" color="textSecondary">
              Already have an account?
            </AppText>
            <Link href="/(auth)/login" asChild>
              <AppText variant="bodySemiBold" color="ink">
                {' '}
                Sign in
              </AppText>
            </Link>
          </View>
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
  subtitle: {
    marginTop: Spacing.xs,
  },
  form: {
    gap: Spacing.lg,
    marginTop: Spacing['2xl'],
  },
  submitButton: {
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing['3xl'],
  },
});
