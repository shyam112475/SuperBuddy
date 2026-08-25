import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partnerProfileFormSchema, type PartnerProfileFormValues } from './schemas';
import { useUpdatePartnerProfile } from './hooks';
import { FormField } from '../../components/FormField';
import type { PublicPartner } from './types';
import type { AxiosError } from 'axios';

export function EditPartnerProfileSection({
  profile,
}: {
  profile: PublicPartner;
}) {
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

  const isVerified = profile.partner.verificationStatus === 'VERIFIED';

  const onSubmit = (values: PartnerProfileFormValues) =>
    mutate({
      ...values,
      area: values.area || undefined,
    });

  return (
    <section className="min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
              Your companion profile
            </h1>

            {isVerified && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.3a1 1 0 0 1-1.42.006l-3.75-3.65a1 1 0 1 1 1.4-1.43l3.04 2.958 6.55-6.596a1 1 0 0 1 1.424-.002Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-neutral-500">
            Keep your profile up to date so people know who they&apos;ll be
            spending time with.
          </p>
        </div>

        {/* Verification status */}
        <div
          className={`flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
            isVerified
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-amber-200 bg-amber-50 text-amber-700'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isVerified ? 'bg-green-500' : 'bg-amber-500'
            }`}
          />

          {isVerified ? 'Verified profile' : 'Pending verification'}
        </div>
      </div>

      {/* Verification notice */}
      <div
        className={`mt-6 rounded-xl border p-4 ${
          isVerified
            ? 'border-green-100 bg-green-50/50'
            : 'border-amber-100 bg-amber-50/50'
        }`}
      >
        <div className="flex gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              isVerified ? 'bg-green-100' : 'bg-amber-100'
            }`}
          >
            {isVerified ? (
              <svg
                className="h-4 w-4 text-green-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l3.586-4Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4 text-amber-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.5m0 3h.01M10.29 3.86 2.82 17a2 2 0 0 0 1.74 3h14.88a2 2 0 0 0 1.74-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                />
              </svg>
            )}
          </div>

          <div>
            <p
              className={`text-sm font-medium ${
                isVerified ? 'text-green-800' : 'text-amber-800'
              }`}
            >
              {isVerified
                ? 'Your profile is publicly visible'
                : 'Your profile is awaiting verification'}
            </p>

            <p
              className={`mt-0.5 text-xs leading-5 ${
                isVerified ? 'text-green-700' : 'text-amber-700'
              }`}
            >
              {isVerified
                ? 'People can discover your profile and request activities with you.'
                : 'An admin needs to verify your profile before it becomes visible to other users.'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        className="mt-8 max-w-2xl"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 px-5 py-4 sm:px-6">
            <h2 className="text-sm font-semibold text-neutral-900">
              Profile information
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              This information helps people decide whether you&apos;re a good
              match for their activity.
            </p>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            {/* Headline */}
            <FormField
              label="Headline"
              placeholder="e.g. Friendly hiking buddy & weekend explorer"
              error={errors.headline?.message}
              {...register('headline')}
            />

            {/* Bio */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-neutral-700">
                  About you
                </label>

                <span className="text-[11px] text-neutral-400">
                  Tell people what makes you a great companion
                </span>
              </div>

              <textarea
                rows={6}
                placeholder="Share a little about yourself, your interests, and the kind of activities you enjoy doing with others."
                className={`mt-1.5 w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 focus:ring-2 ${
                  errors.bio
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                    : 'border-neutral-200 focus:border-brand-500 focus:ring-brand-100'
                }`}
                {...register('bio')}
              />

              {errors.bio && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.bio.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Location
              </p>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  label="City"
                  placeholder="e.g. Indore"
                  error={errors.city?.message}
                  {...register('city')}
                />

                <FormField
                  label="Area / neighborhood"
                  placeholder="e.g. Vijay Nagar"
                  error={errors.area?.message}
                  {...register('area')}
                />
              </div>
            </div>

            {/* API error */}
            {apiError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <div className="flex gap-2">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3m0 4h.01M10.29 3.86 2.82 17a2 2 0 0 0 1.74 3h14.88a2 2 0 0 0 1.74-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                    />
                  </svg>

                  <p className="text-sm text-red-700">
                    {apiError.response?.data?.message ||
                      'Something went wrong. Please try again.'}
                  </p>
                </div>
              </div>
            )}

            {/* Success */}
            {isSuccess && !isDirty && (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5">
                <svg
                  className="h-4 w-4 text-green-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.3a1 1 0 0 1-1.42.006l-3.75-3.65a1 1 0 1 1 1.4-1.43l3.04 2.958 6.55-6.596a1 1 0 0 1 1.424-.002Z"
                    clipRule="evenodd"
                  />
                </svg>

                <p className="text-sm font-medium text-green-700">
                  Profile saved successfully.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-3 border-t border-neutral-100 bg-neutral-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs text-neutral-500">
              {isDirty
                ? 'You have unsaved changes.'
                : 'Your profile is up to date.'}
            </p>

            <button
              type="submit"
              disabled={isPending || !isDirty}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending && (
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
                  />
                </svg>
              )}

              {isPending ? 'Saving changes…' : 'Save profile'}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}