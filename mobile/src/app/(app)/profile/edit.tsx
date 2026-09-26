import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AxiosError } from 'axios';
import { AppText, AppView, Button, DateField, PillSelector, TextField } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useMe, useUpdateProfile } from '@/features/users/hooks';
import { ProfileImagePicker } from '@/features/users/ProfileImagePicker';
import { editProfileFormSchema, type EditProfileFormValues } from '@/features/users/schemas';

const GENDER_OPTIONS = [
  { value: 'MALE' as const, label: 'Male' },
  { value: 'FEMALE' as const, label: 'Female' },
  { value: 'NON_BINARY' as const, label: 'Non-binary' },
  { value: 'PREFER_NOT_TO_SAY' as const, label: 'Prefer not to say' },
];

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: user, isLoading } = useMe();
  const { mutate, isPending, error, isSuccess } = useUpdateProfile();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditProfileFormValues>({ resolver: zodResolver(editProfileFormSchema) });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        phoneNumber: user.phoneNumber ?? '',
        gender: (user.gender as EditProfileFormValues['gender']) ?? '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '',
        emergencyContactName: user.emergencyContactName ?? '',
        emergencyContactPhone: user.emergencyContactPhone ?? '',
      });
    }
  }, [user, reset]);

  const apiError = error as AxiosError<{ message: string }> | null;

  function onSubmit(values: EditProfileFormValues) {
    mutate(
      {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber || undefined,
        gender: values.gender || undefined,
        dateOfBirth: values.dateOfBirth || undefined,
        emergencyContactName: values.emergencyContactName || undefined,
        emergencyContactPhone: values.emergencyContactPhone || undefined,
      },
      { onSuccess: () => router.back() }
    );
  }

  if (isLoading || !user) {
    return (
      <AppView style={{ flex: 1 }}>
        <View style={[styles.content, { paddingTop: insets.top + Spacing.xl }]}>
          <AppText variant="body" color="textSecondary">
            Loading…
          </AppText>
        </View>
      </AppView>
    );
  }

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
          <AppText variant="title">Edit profile</AppText>

          <View style={styles.imageSection}>
            <ProfileImagePicker currentImageUrl={user.profileImage} fullName={user.fullName} />
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="fullName"
              render={({ field }) => (
                <TextField
                  label="Full name"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.fullName?.message}
                />
              )}
            />

            <View>
              <AppText variant="label" color="textSecondary" style={styles.readOnlyLabel}>
                Email
              </AppText>
              <AppText variant="body" color="textSecondary">
                {user.email} (cannot be changed here)
              </AppText>
            </View>

            <Controller
              control={control}
              name="phoneNumber"
              render={({ field }) => (
                <TextField
                  label="Phone number"
                  value={field.value}
                  onChangeText={field.onChange}
                  keyboardType="phone-pad"
                  error={errors.phoneNumber?.message}
                />
              )}
            />

            <View>
              <AppText variant="label" color="textSecondary" style={styles.readOnlyLabel}>
                Gender
              </AppText>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <PillSelector
                    options={GENDER_OPTIONS}
                    value={field.value || undefined}
                    onChange={field.onChange}
                  />
                )}
              />
            </View>

            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field }) => (
                <DateField
                  label="Date of birth"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  maximumDate={new Date()}
                />
              )}
            />

            <View style={styles.emergencySection}>
              <AppText variant="subtitle">Emergency contact</AppText>
              <AppText variant="caption" color="textTertiary" style={styles.emergencyHint}>
                Only used if you trigger an SOS alert during a booking. Never shown on your public
                profile.
              </AppText>
              <View style={styles.emergencyFields}>
                <Controller
                  control={control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <TextField
                      label="Contact name"
                      value={field.value}
                      onChangeText={field.onChange}
                      error={errors.emergencyContactName?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <TextField
                      label="Contact phone"
                      value={field.value}
                      onChangeText={field.onChange}
                      keyboardType="phone-pad"
                      error={errors.emergencyContactPhone?.message}
                    />
                  )}
                />
              </View>
            </View>

            {apiError && (
              <AppText variant="caption" color="danger">
                {apiError.response?.data?.message ?? 'Something went wrong. Please try again.'}
              </AppText>
            )}
            {isSuccess && <AppText variant="caption" color="success">Profile updated.</AppText>}

            <Button
              label="Save changes"
              fullWidth
              size="lg"
              loading={isPending}
              disabled={!isDirty}
              onPress={handleSubmit(onSubmit)}
            />
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
  imageSection: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  form: {
    gap: Spacing.lg,
    marginTop: Spacing['2xl'],
  },
  readOnlyLabel: {
    marginLeft: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  emergencySection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#00000015',
  },
  emergencyHint: {
    marginTop: Spacing.xs,
  },
  emergencyFields: {
    gap: Spacing.lg,
    marginTop: Spacing.md,
  },
});
