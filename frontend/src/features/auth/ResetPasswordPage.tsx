import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  resetPasswordFormSchema,
  type ResetPasswordFormValues,
} from './schemas';
import { useResetPassword } from './hooks';
import { FormField } from '../../components/FormField';
import type { AxiosError } from 'axios';

function LockIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path strokeLinecap="round" d="M8 10V7a4 4 0 018 0v3" />
      <path strokeLinecap="round" d="M12 14v3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12.5l4.5 4.5L19 7.5"
      />
    </svg>
  );
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { mutate, isPending, error } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const apiError = error as AxiosError<{ message: string }> | null;

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-neutral-50 px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 text-center shadow-sm sm:p-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
              </svg>
            </div>

            <h1 className="mt-6 text-xl font-bold text-neutral-900">
              Invalid reset link
            </h1>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              This reset link is missing or invalid. Please request a new
              password reset link.
            </p>

            <Link
              to="/forgot-password"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/20"
            >
              Request a new link
            </Link>

            <Link
              to="/login"
              className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = (values: ResetPasswordFormValues) =>
    mutate({
      token,
      newPassword: values.newPassword,
    });

  return (
    <div className="min-h-[calc(100vh-80px)] bg-neutral-50 px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <LockIcon />
          </div>

          {/* Heading */}
          <div className="mt-6">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Set a new password
            </h1>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Choose a strong password for your SuperBuddy account.
            </p>
          </div>

          <form
            className="mt-7 space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <FormField
              label="New password"
              type="password"
              autoComplete="new-password"
              placeholder="Enter your new password"
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />

            <FormField
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your new password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {/* API Error */}
            {apiError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <div className="flex gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path
                      strokeLinecap="round"
                      d="M12 8v4M12 16h.01"
                    />
                  </svg>

                  <p className="text-sm leading-5 text-red-700">
                    {apiError.response?.data?.message ||
                      'This link may have expired. Please request a new one.'}
                  </p>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Resetting password...
                </>
              ) : (
                <>
                  Reset password
                  <CheckIcon />
                </>
              )}
            </button>
          </form>

          {/* Back */}
          <div className="mt-7 border-t border-neutral-100 pt-6 text-center">
            <Link
              to="/login"
              className="text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              Back to sign in
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-neutral-400">
          Your password is securely protected.
        </p>
      </div>
    </div>
  );
}