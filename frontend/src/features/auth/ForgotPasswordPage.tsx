import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordFormSchema, type ForgotPasswordFormValues } from './schemas';
import { useForgotPassword } from './hooks';
import { FormField } from '../../components/FormField';

export function ForgotPasswordPage() {
  const { mutate, isPending, isSuccess } = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordFormSchema) });

  const onSubmit = (values: ForgotPasswordFormValues) => mutate(values.email);

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-2xl font-bold text-neutral-900">Reset your password</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Enter your email and we'll send you a link to reset your password.
      </p>

      {isSuccess ? (
        <div className="mt-8 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          If an account with that email exists, a reset link has been sent. Check your inbox.
        </div>
      ) : (
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {isPending ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-neutral-600">
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
