import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  loginFormSchema,
  type LoginFormValues,
} from './schemas';
import { useLogin } from './hooks';
import { FormField } from '../../components/FormField';
import type { AxiosError } from 'axios';

function UserIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 21a7 7 0 0114 0"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M3.75 10a.75.75 0 01.75-.75h10.69l-3.22-3.22a.75.75 0 111.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06-1.06l3.22-3.22H4.5a.75.75 0 01-.75-.75z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function LoginPage() {
  const { mutate, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = (values: LoginFormValues) => mutate(values);

  const apiError = error as AxiosError<{ message: string }> | null;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-neutral-50 px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto w-full max-w-md">
        {/* Login Card */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <UserIcon />
          </div>

          {/* Heading */}
          <div className="mt-6">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Sign in to your SuperBuddy account to continue.
            </p>
          </div>

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

            <FormField
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register('password')}
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
                      'Something went wrong. Please try again.'}
                  </p>
                </div>
              </div>
            )}

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowIcon />
                </>
              )}
            </button>
          </form>

          {/* Register */}
          <div className="mt-7 border-t border-neutral-100 pt-6 text-center">
            <p className="text-sm text-neutral-500">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-brand-600 transition-colors hover:text-brand-700"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-xs text-neutral-400">
          Your account and personal information are protected.
        </p>
      </div>
    </div>
  );
}