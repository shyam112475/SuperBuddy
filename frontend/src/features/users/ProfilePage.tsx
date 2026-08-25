import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMe, useUpdateProfile } from './hooks';
import {
  editProfileFormSchema,
  type EditProfileFormValues,
} from './schemas';
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
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileFormSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        phoneNumber: user.phoneNumber ?? '',
        gender: (user.gender as EditProfileFormValues['gender']) ?? '',
        dateOfBirth: user.dateOfBirth
          ? user.dateOfBirth.slice(0, 10)
          : '',
        emergencyContactName: user.emergencyContactName ?? '',
        emergencyContactPhone: user.emergencyContactPhone ?? '',
      });
    }
  }, [user, reset]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="animate-pulse">
            <div className="h-8 w-40 rounded-lg bg-neutral-200" />
            <div className="mt-3 h-4 w-72 rounded bg-neutral-200" />

            <div className="mt-8 h-40 rounded-2xl bg-neutral-200" />

            <div className="mt-6 h-96 rounded-2xl bg-neutral-200" />
          </div>
        </div>
      </div>
    );
  }

  const apiError = error as AxiosError<{ message: string }> | null;

  const onSubmit = (values: EditProfileFormValues) => {
    mutate({
      fullName: values.fullName,
      phoneNumber: values.phoneNumber || undefined,
      gender: values.gender || undefined,
      dateOfBirth: values.dateOfBirth || undefined,
      emergencyContactName:
        values.emergencyContactName || undefined,
      emergencyContactPhone:
        values.emergencyContactPhone || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-brand-600">
              Account
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900">
              Your Profile
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              Manage your personal information and safety details.
            </p>
          </div>

          <Link
            to="/account/settings"
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50"
          >
            Account settings →
          </Link>
        </div>

        {/* Main Layout */}
        <div className="mt-8 grid grid-cols-[1fr_300px] gap-6">

          {/* Left Content */}
          <div className="space-y-6">

            {/* Personal Information */}
            <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="8" r="3" />
                    <path
                      strokeLinecap="round"
                      d="M5 20c.8-3.5 3.2-5 7-5s6.2 1.5 7 5"
                    />
                  </svg>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Personal information
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    Keep your profile information up to date.
                  </p>
                </div>
              </div>

              <form
                className="mt-6 space-y-5"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                {/* Name */}
                <FormField
                  label="Full name"
                  error={errors.fullName?.message}
                  {...register('fullName')}
                />

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Email
                  </label>

                  <div className="mt-1 flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5">
                    <span className="text-sm text-neutral-600">
                      {user.email}
                    </span>

                    <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[11px] font-medium text-neutral-500">
                      Cannot change
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <FormField
                  label="Phone number"
                  type="tel"
                  error={errors.phoneNumber?.message}
                  {...register('phoneNumber')}
                />

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Gender
                  </label>

                  <select
                    className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    {...register('gender')}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="NON_BINARY">Non-binary</option>
                    <option value="PREFER_NOT_TO_SAY">
                      Prefer not to say
                    </option>
                  </select>
                </div>

                {/* DOB */}
                <FormField
                  label="Date of birth"
                  type="date"
                  error={errors.dateOfBirth?.message}
                  {...register('dateOfBirth')}
                />

                {/* Emergency Contact */}
                <div className="border-t border-neutral-100 pt-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v4M12 17h.01"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.3 4.5L2.9 17a2 2 0 001.7 3h14.8a2 2 0 001.7-3L13.7 4.5a2 2 0 00-3.4 0z"
                        />
                      </svg>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-neutral-800">
                        Emergency contact
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-neutral-500">
                        Only used if you trigger an SOS alert during a
                        booking. This information is never shown on your
                        public profile.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-5">
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

                {/* Messages */}
                {apiError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-700">
                      {apiError.response?.data?.message ||
                        'Something went wrong. Please try again.'}
                    </p>
                  </div>
                )}

                {isSuccess && !isDirty && (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                    <p className="text-sm font-medium text-green-700">
                      Profile updated successfully.
                    </p>
                  </div>
                )}

                {/* Save */}
                <div className="flex items-center justify-between border-t border-neutral-100 pt-5">
                  <p className="text-xs text-neutral-400">
                    Changes are saved to your account.
                  </p>

                  <button
                    type="submit"
                    disabled={isPending || !isDirty}
                    className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPending ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">

            {/* Profile Photo */}
            <ProfileImageUploader
              currentImageUrl={user.profileImage}
              fullName={user.fullName}
            />

            {/* Privacy / Safety Card */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3l7 3v5c0 4.5-2.8 8-7 10-4.2-2-7-5.5-7-10V6l7-3z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4"
                    />
                  </svg>
                </div>

                <h3 className="font-semibold text-neutral-900">
                  Your privacy
                </h3>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />

                  <p className="text-xs leading-5 text-neutral-500">
                    Your emergency contact is never visible on your public
                    profile.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />

                  <p className="text-xs leading-5 text-neutral-500">
                    Your email address cannot be changed from this page.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />

                  <p className="text-xs leading-5 text-neutral-500">
                    SOS information is only used when necessary for safety.
                  </p>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-neutral-900">
                Account & security
              </h3>

              <p className="mt-1 text-sm text-neutral-500">
                Manage your password, blocked users and account.
              </p>

              <Link
                to="/account/settings"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
              >
                Open account settings
              </Link>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}