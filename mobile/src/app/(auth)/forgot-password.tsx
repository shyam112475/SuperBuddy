import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, AppView, Button, Card, TextField } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useForgotPassword } from '@/features/auth/hooks';
import { forgotPasswordFormSchema, type ForgotPasswordFormValues } from '@/features/auth/schemas';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const { mutate, isPending, isSuccess } = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordFormSchema) });

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
          <AppText variant="title">Reset your password</AppText>
          <AppText variant="body" color="textSecondary" style={styles.subtitle}>
            Enter your email and we&apos;ll send you a link to reset your password.
          </AppText>

          {isSuccess ? (
            <Card style={styles.successCard}>
              <AppText variant="body" color="success">
                If an account with that email exists, a reset link has been sent. Check your
                inbox.
              </AppText>
            </Card>
          ) : (
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
                    error={errors.email?.message}
                  />
                )}
              />
              <Button
                label="Send reset link"
                fullWidth
                size="lg"
                loading={isPending}
                onPress={handleSubmit((values) => mutate(values.email))}
              />
            </View>
          )}

          <View style={styles.footer}>
            <Link href="/(auth)/login" asChild>
              <AppText variant="bodySemiBold" color="ink">
                Back to sign in
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
  successCard: {
    marginTop: Spacing['2xl'],
  },
  form: {
    gap: Spacing.lg,
    marginTop: Spacing['2xl'],
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing['3xl'],
  },
});
