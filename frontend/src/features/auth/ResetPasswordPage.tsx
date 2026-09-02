import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordFormSchema, type ResetPasswordFormValues } from './schemas';
import { useResetPassword } from './hooks';
import { FormField } from '../../components/FormField';
import type { AxiosError } from 'axios';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { mutate, isPending, error } = useResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordFormSchema) });

  const apiError = error as AxiosError<{ message: string }> | null;

  if (!token) {
    return (
      <div className="mx-auto max-w-sm px-6 py-16 text-center">
        <p className="text-sm text-red-600">
          This reset link is missing or invalid. Please request a new one.
        </p>
        <Link to="/forgot-password" className="mt-4 inline-block text-sm text-brand-600 hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  const onSubmit = (values: ResetPasswordFormValues) =>
    mutate({ token, newPassword: values.newPassword });

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-2xl font-bold text-neutral-900">Set a new password</h1>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
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
            {apiError.response?.data?.message ||
              'This link may have expired. Please request a new one.'}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {isPending ? 'Resetting…' : 'Reset password'}
        </button>
      </form>
    </div>
  );
}
