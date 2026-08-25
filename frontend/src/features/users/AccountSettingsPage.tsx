import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  changePasswordFormSchema,
  type ChangePasswordFormValues,
} from './schemas';
import { useChangePassword, useDeleteAccount } from './hooks';
import { FormField } from '../../components/FormField';
import { ManageBlocksSection } from '../safety/ManageBlocksSection';
import type { AxiosError } from 'axios';

function ChangePasswordSection() {
  const { mutate, isPending, error, isSuccess } = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
  });

  const apiError = error as AxiosError<{ message: string }> | null;

  const onSubmit = (values: ChangePasswordFormValues) => {
    mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  return (
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
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path
              strokeLinecap="round"
              d="M8 10V7a4 4 0 018 0v3"
            />
            <circle cx="12" cy="15" r="1" />
          </svg>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Change password
          </h2>

          <p className="mt-1 text-sm leading-5 text-neutral-500">
            Keep your account secure by using a strong password.
          </p>
        </div>
      </div>

      <form
        className="mt-6 max-w-lg space-y-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <FormField
          label="Current password"
          type="password"
          autoComplete="current-password"
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
        />

        <FormField
          label="New password"
          type="password"
          autoComplete="new-password"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />

        <FormField
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="rounded-xl bg-neutral-50 px-4 py-3">
          <p className="text-xs leading-5 text-neutral-500">
            For your security, you'll be signed out of other devices after
            changing your password.
          </p>
        </div>

        {apiError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">
              {apiError.response?.data?.message ||
                'Something went wrong. Please try again.'}
            </p>
          </div>
        )}

        {isSuccess && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <p className="text-sm text-green-700">
              Password changed successfully. Redirecting…
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Changing…' : 'Change password'}
        </button>
      </form>
    </section>
  );
}

function DeleteAccountSection() {
  const [confirming, setConfirming] = useState(false);
  const { mutate, isPending } = useDeleteAccount();

  return (
    <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-red-700">
            Delete account
          </h2>

          <p className="mt-1 max-w-xl text-sm leading-6 text-neutral-500">
            Deleting your account will deactivate your profile and sign you
            out everywhere. This action cannot be undone from the app.
          </p>
        </div>
      </div>

      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-5 rounded-xl border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
        >
          Delete my account
        </button>
      ) : (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-800">
            Are you sure you want to delete your account?
          </p>

          <p className="mt-1 text-xs leading-5 text-red-700">
            Your account will be deactivated and you'll be signed out
            everywhere.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => mutate()}
              disabled={isPending}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending
                ? 'Deleting…'
                : 'Yes, permanently delete my account'}
            </button>

            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={isPending}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-white disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export function AccountSettingsPage() {
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
              Account Settings
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              Manage your security, payments and account preferences.
            </p>
          </div>

          <Link
            to="/profile"
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50"
          >
            ← Back to profile
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-2 gap-4">

          <Link
            to="/payments"
            className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                ₹
              </div>

              <span className="text-neutral-300 transition group-hover:text-brand-500">
                →
              </span>
            </div>

            <h3 className="mt-4 font-semibold text-neutral-900">
              Payment history
            </h3>

            <p className="mt-1 text-sm text-neutral-500">
              View your previous payments and transactions.
            </p>
          </Link>

          <Link
            to="/profile"
            className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
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

              <span className="text-neutral-300 transition group-hover:text-brand-500">
                →
              </span>
            </div>

            <h3 className="mt-4 font-semibold text-neutral-900">
              Profile settings
            </h3>

            <p className="mt-1 text-sm text-neutral-500">
              Update your personal information and profile.
            </p>
          </Link>
        </div>

        {/* Settings */}
        <div className="mt-8 space-y-6">

          <ChangePasswordSection />

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <ManageBlocksSection />
          </div>

          <DeleteAccountSection />

        </div>
      </div>
    </div>
  );
}