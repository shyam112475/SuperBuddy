import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partnerProfileFormSchema, type PartnerProfileFormValues } from './schemas';
import { useCreatePartnerProfile } from './hooks';
import { FormField } from '../../components/FormField';
import type { AxiosError } from 'axios';

export function BecomePartnerForm() {
  const { mutate, isPending, error } = useCreatePartnerProfile();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PartnerProfileFormValues>({ resolver: zodResolver(partnerProfileFormSchema) });

  const apiError = error as AxiosError<{ message: string }> | null;

  const onSubmit = (values: PartnerProfileFormValues) =>
    mutate({ ...values, area: values.area || undefined });

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <h1 className="text-2xl font-bold text-neutral-900">Become a companion</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Tell people what you're like and what activities you'd offer. You'll pick specific
        services and set your availability after this step. Your profile becomes visible to
        others once an admin verifies it.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          label="Headline"
          placeholder="e.g. Friendly hiking buddy & weekend explorer"
          error={errors.headline?.message}
          {...register('headline')}
        />
        <div>
          <label className="block text-sm font-medium text-neutral-700">Bio</label>
          <textarea
            rows={5}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="Share a bit about yourself and the kind of company you enjoy being for others."
            {...register('bio')}
          />
          {errors.bio && <p className="mt-1 text-xs text-red-600">{errors.bio.message}</p>}
        </div>
        <FormField label="City" error={errors.city?.message} {...register('city')} />
        <FormField
          label="Area / neighborhood (optional)"
          error={errors.area?.message}
          {...register('area')}
        />

        {apiError && (
          <p className="text-sm text-red-600">
            {apiError.response?.data?.message || 'Something went wrong. Please try again.'}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {isPending ? 'Creating…' : 'Create partner profile'}
        </button>
      </form>
    </div>
  );
}
