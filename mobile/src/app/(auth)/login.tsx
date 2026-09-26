import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AxiosError } from 'axios';
import { AppText, AppView, Button, CompanionMark, TextField } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useLogin } from '@/features/auth/hooks';
import { loginFormSchema, type LoginFormValues } from '@/features/auth/schemas';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { mutate, isPending, error } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginFormSchema) });

  const apiError = error as AxiosError<{ message: string }> | null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + Spacing['3xl'], paddingBottom: insets.bottom + Spacing['2xl'] },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.brand}>
            <CompanionMark size={56} />
            <AppText variant="display" style={styles.brandName}>
              CompanionHub
            </AppText>
            <AppText variant="body" color="textSecondary" style={styles.tagline}>
              Find people for the things you actually want to do.
            </AppText>
          </View>

          <View style={styles.form}>
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
                  placeholder="you@example.com"
                  error={errors.email?.message}
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
                  autoComplete="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                />
              )}
            />

            <Link href="/(auth)/forgot-password" asChild>
              <AppText variant="caption" color="ink" style={styles.forgotLink}>
                Forgot password?
              </AppText>
            </Link>

            {apiError && (
              <AppText variant="caption" color="danger">
                {apiError.response?.data?.message ?? 'Something went wrong. Please try again.'}
              </AppText>
            )}

            <Button
              label="Sign In"
              fullWidth
              size="lg"
              loading={isPending}
              onPress={handleSubmit((values) => mutate(values))}
              style={styles.submitButton}
            />
          </View>

          <View style={styles.footer}>
            <AppText variant="body" color="textSecondary">
              Don&apos;t have an account?
            </AppText>
            <Link href="/(auth)/register" asChild>
              <AppText variant="bodySemiBold" color="ink">
                {' '}
                Sign up
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
  brand: {
    alignItems: 'center',
    marginBottom: Spacing['4xl'],
  },
  brandName: {
    marginTop: Spacing.lg,
  },
  tagline: {
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  form: {
    gap: Spacing.lg,
  },
  forgotLink: {
    alignSelf: 'flex-end',
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
