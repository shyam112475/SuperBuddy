import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  registerFormSchema,
  type RegisterFormValues,
} from './schemas';
import { useRegister } from './hooks';
import { FormField } from '../../components/FormField';
import type { AxiosError } from 'axios';

function UserPlusIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="9" cy="8" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.5 21a6.5 6.5 0 0113 0"
      />
      <path strokeLinecap="round" d="M19 8v6M16 11h6" />
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

function ShieldIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l7 3v5c0 4.7-2.9 8.2-7 10-4.1-1.8-7-5.3-7-10V6l7-3z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4"
      />
    </svg>
  );
}

export function RegisterPage() {
  const { mutate, isPending, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = (values: RegisterFormValues) =>
    mutate({
      ...values,
      phoneNumber: values.phoneNumber || undefined,
    });

  const apiError = error as AxiosError<{ message: string }> | null;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-neutral-50 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <UserPlusIcon />
          </div>

          {/* Heading */}
          <div className="mt-6">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Join SuperBuddy to find or offer non-sexual companionship
              and activities.
            </p>
          </div>

          <form
            className="mt-7 space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <FormField
              label="Full name"
              autoComplete="name"
              placeholder="Enter your full name"
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <FormField
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <FormField
              label="Phone number"
              type="tel"
              autoComplete="tel"
              placeholder="Optional"
              error={errors.phoneNumber?.message}
              {...register('phoneNumber')}
            />

            <FormField
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a strong password"
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

            {/* Terms / Platform rule */}
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3.5">
              <div className="flex gap-3">
                <div className="mt-0.5 shrink-0 text-brand-600">
                  <ShieldIcon />
                </div>

                <p className="text-xs leading-5 text-neutral-600">
                  By signing up you agree that SuperBuddy is for
                  <span className="font-semibold text-neutral-800">
                    {' '}non-sexual companionship and activities only.
                  </span>
                </p>
              </div>
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
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowIcon />
                </>
              )}
            </button>
          </form>

          {/* Login */}
          <div className="mt-7 border-t border-neutral-100 pt-6 text-center">
            <p className="text-sm text-neutral-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-brand-600 transition-colors hover:text-brand-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-xs text-neutral-400">
          Your information is securely handled by SuperBuddy.
        </p>
      </div>
    </div>
  );
}