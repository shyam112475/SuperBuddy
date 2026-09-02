import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partnerProfileFormSchema, type PartnerProfileFormValues } from './schemas';
import { useUpdatePartnerProfile } from './hooks';
import { FormField } from '../../components/FormField';
import type { PublicPartner } from './types';
import type { AxiosError } from 'axios';

export function EditPartnerProfileSection({ profile }: { profile: PublicPartner }) {
  const { mutate, isPending, error, isSuccess } = useUpdatePartnerProfile();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<PartnerProfileFormValues>({
    resolver: zodResolver(partnerProfileFormSchema),
    defaultValues: {
      headline: profile.headline,
      bio: profile.bio,
      city: profile.city,
      area: profile.area ?? '',
    },
  });

  const apiError = error as AxiosError<{ message: string }> | null;

  const onSubmit = (values: PartnerProfileFormValues) =>
    mutate({ ...values, area: values.area || undefined });

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Your companion profile</h1>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            profile.partner.verificationStatus === 'VERIFIED'
              ? 'bg-green-50 text-green-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {profile.partner.verificationStatus === 'VERIFIED'
            ? 'Verified — visible to everyone'
            : 'Pending verification — not yet publicly visible'}
        </span>
      </div>

      <form className="mt-6 max-w-lg space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Headline" error={errors.headline?.message} {...register('headline')} />
        <div>
          <label className="block text-sm font-medium text-neutral-700">Bio</label>
          <textarea
            rows={5}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            {...register('bio')}
          />
          {errors.bio && <p className="mt-1 text-xs text-red-600">{errors.bio.message}</p>}
        </div>
        <FormField label="City" error={errors.city?.message} {...register('city')} />
        <FormField label="Area" error={errors.area?.message} {...register('area')} />

        {apiError && (
          <p className="text-sm text-red-600">
            {apiError.response?.data?.message || 'Something went wrong. Please try again.'}
          </p>
        )}
        {isSuccess && !isDirty && <p className="text-sm text-green-600">Saved.</p>}

        <button
          type="submit"
          disabled={isPending || !isDirty}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {isPending ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </section>
  );
}
