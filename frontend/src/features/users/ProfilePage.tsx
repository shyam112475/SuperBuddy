import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMe, useUpdateProfile } from './hooks';
import { editProfileFormSchema, type EditProfileFormValues } from './schemas';
import { ProfileImageUploader } from './ProfileImageUploader';
import { FormField } from '../../components/FormField';
import type { AxiosError } from 'axios';

export function ProfilePage() {
  const { data: user, isLoading } = useMe();
  const { mutate, isPending, error, isSuccess } = useUpdateProfile();

  const {
    register,
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

  if (isLoading || !user) {
    return <div className="mx-auto max-w-2xl px-6 py-16 text-sm text-neutral-500">Loading…</div>;
  }

  const apiError = error as AxiosError<{ message: string }> | null;

  const onSubmit = (values: EditProfileFormValues) =>
    mutate({
      fullName: values.fullName,
      phoneNumber: values.phoneNumber || undefined,
      gender: values.gender || undefined,
      dateOfBirth: values.dateOfBirth || undefined,
      emergencyContactName: values.emergencyContactName || undefined,
      emergencyContactPhone: values.emergencyContactPhone || undefined,
    });

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Your Profile</h1>
        <Link to="/account/settings" className="text-sm text-brand-600 hover:underline">
          Account settings
        </Link>
      </div>

      <div className="mt-6">
        <ProfileImageUploader currentImageUrl={user.profileImage} fullName={user.fullName} />
      </div>

      <form className="mt-8 max-w-md space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Full name" error={errors.fullName?.message} {...register('fullName')} />

        <div>
          <label className="block text-sm font-medium text-neutral-700">Email</label>
          <p className="mt-1 text-sm text-neutral-500">{user.email} (cannot be changed here)</p>
        </div>

        <FormField
          label="Phone number"
          type="tel"
          error={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />

        <div>
          <label className="block text-sm font-medium text-neutral-700">Gender</label>
          <select
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            {...register('gender')}
          >
            <option value="">Prefer not to say</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="NON_BINARY">Non-binary</option>
            <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
          </select>
        </div>

        <FormField
          label="Date of birth"
          type="date"
          error={errors.dateOfBirth?.message}
          {...register('dateOfBirth')}
        />

        <div className="border-t border-neutral-100 pt-4">
          <h2 className="text-sm font-semibold text-neutral-700">Emergency contact</h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            Only used if you trigger an SOS alert during a booking. Never shown on your public
            profile.
          </p>
          <div className="mt-3 space-y-4">
            <FormField
              label="Contact name"
              error={errors.emergencyContactName?.message}
              {...register('emergencyContactName')}
            />
            <FormField
              label="Contact phone"
              type="tel"
              error={errors.emergencyContactPhone?.message}
              {...register('emergencyContactPhone')}
            />
          </div>
        </div>

        {apiError && (
          <p className="text-sm text-red-600">
            {apiError.response?.data?.message || 'Something went wrong. Please try again.'}
          </p>
        )}
        {isSuccess && !isDirty && <p className="text-sm text-green-600">Profile updated.</p>}

        <button
          type="submit"
          disabled={isPending || !isDirty}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {isPending ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
