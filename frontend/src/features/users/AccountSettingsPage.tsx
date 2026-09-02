import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordFormSchema, type ChangePasswordFormValues } from './schemas';
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
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordFormSchema) });

  const apiError = error as AxiosError<{ message: string }> | null;

  const onSubmit = (values: ChangePasswordFormValues) =>
    mutate({ currentPassword: values.currentPassword, newPassword: values.newPassword });

  return (
    <section className="border-t border-neutral-200 pt-8">
      <h2 className="text-lg font-semibold text-neutral-900">Change password</h2>
      <p className="mt-1 text-sm text-neutral-600">
        You'll be signed out of all devices after changing your password.
      </p>

      <form className="mt-4 max-w-sm space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
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

        {apiError && (
          <p className="text-sm text-red-600">
            {apiError.response?.data?.message || 'Something went wrong. Please try again.'}
          </p>
        )}
        {isSuccess && <p className="text-sm text-green-600">Password changed. Redirecting…</p>}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
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
    <section className="border-t border-neutral-200 pt-8">
      <h2 className="text-lg font-semibold text-red-700">Delete account</h2>
      <p className="mt-1 max-w-md text-sm text-neutral-600">
        This deactivates your account and signs you out everywhere. This can't be undone from
        the app — contact support if you change your mind.
      </p>

      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-4 rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          Delete my account
        </button>
      ) : (
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => mutate()}
            disabled={isPending}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? 'Deleting…' : 'Yes, permanently delete my account'}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={isPending}
            className="text-sm text-neutral-600 hover:underline"
          >
            Cancel
          </button>
        </div>
      )}
    </section>
  );
}

export function AccountSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Account Settings</h1>
        <Link to="/profile" className="text-sm text-brand-600 hover:underline">
          Back to profile
        </Link>
      </div>

      <div className="mt-4">
        <Link to="/payments" className="text-sm text-brand-600 hover:underline">
          View payment history →
        </Link>
      </div>

      <div className="mt-8 space-y-8">
        <ChangePasswordSection />
        <ManageBlocksSection />
        <DeleteAccountSection />
      </div>
    </div>
  );
}
