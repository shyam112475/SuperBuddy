import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormValues,
} from './schemas';
import { useForgotPassword } from './hooks';
import { FormField } from '../../components/FormField';

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

export function ForgotPasswordPage() {
  const { mutate, isPending, isSuccess } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
  });

  const onSubmit = (values: ForgotPasswordFormValues) => mutate(values.email);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-neutral-50 px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            {isSuccess ? <CheckIcon /> : <LockIcon />}
          </div>

          {/* Heading */}
          <div className="mt-6">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              {isSuccess ? 'Check your inbox' : 'Reset your password'}
            </h1>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              {isSuccess
                ? "We've sent password reset instructions to your email address."
                : "Enter your email address and we'll send you a secure link to reset your password."}
            </p>
          </div>

          {isSuccess ? (
            /* Success State */
            <div className="mt-7">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 shrink-0 text-emerald-600">
                    <CheckIcon />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-emerald-900">
                      Reset link sent
                    </p>

                    <p className="mt-1 text-sm leading-5 text-emerald-700">
                      If an account with that email exists, a reset link has
                      been sent. Please check your inbox.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Form */
            <form
              className="mt-7 space-y-5"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <FormField
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? 'Sending reset link...' : 'Send reset link'}
              </button>
            </form>
          )}

          {/* Back */}
          <div className="mt-7 border-t border-neutral-100 pt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9.78 4.22a.75.75 0 010 1.06L6.06 9H16.5a.75.75 0 010 1.5H6.06l3.72 3.72a.75.75 0 11-1.06 1.06l-5-5a.75.75 0 010-1.06l5-5a.75.75 0 011.06 0z"
                  clipRule="evenodd"
                />
              </svg>

              Back to sign in
            </Link>
          </div>
        </div>

        {/* Small footer text */}
        <p className="mt-5 text-center text-xs text-neutral-400">
          You'll receive a secure password reset link if an account exists.
        </p>
      </div>
    </div>
  );
}