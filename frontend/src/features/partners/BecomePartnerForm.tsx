import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partnerProfileFormSchema, type PartnerProfileFormValues } from './schemas';
import { useCreatePartnerProfile } from './hooks';
import { FormField } from '../../components/FormField';
import type { AxiosError } from 'axios';

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 21a8 8 0 0 0-16 0"
      />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
      />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"
      />
    </svg>
  );
}

export function BecomePartnerForm() {
  const { mutate, isPending, error } = useCreatePartnerProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PartnerProfileFormValues>({
    resolver: zodResolver(partnerProfileFormSchema),
  });

  const apiError = error as AxiosError<{ message: string }> | null;

  const onSubmit = (values: PartnerProfileFormValues) =>
    mutate({
      ...values,
      area: values.area || undefined,
    });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 shadow-sm">
            <SparkleIcon />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
            Partner onboarding
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Become a companion
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-600 sm:text-base">
            Create your companion profile and let people know what kind of
            activities and experiences you enjoy sharing.
          </p>
        </div>

        {/* Progress */}
        <div className="mx-auto mt-8 flex max-w-xl items-center">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
              1
            </span>
            <span className="text-xs font-medium text-neutral-900 sm:text-sm">
              Profile
            </span>
          </div>

          <div className="mx-3 h-px flex-1 bg-neutral-200" />

          <div className="flex items-center gap-2 text-neutral-400">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 bg-white text-xs font-semibold">
              2
            </span>
            <span className="hidden text-xs font-medium sm:inline sm:text-sm">
              Services
            </span>
          </div>

          <div className="mx-3 h-px flex-1 bg-neutral-200" />

          <div className="flex items-center gap-2 text-neutral-400">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 bg-white text-xs font-semibold">
              3
            </span>
            <span className="hidden text-xs font-medium sm:inline sm:text-sm">
              Availability
            </span>
          </div>
        </div>

        {/* Main card */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 bg-gradient-to-r from-brand-50/80 to-white px-5 py-5 sm:px-7">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm ring-1 ring-brand-100">
                <UserIcon />
              </div>

              <div>
                <h2 className="font-semibold text-neutral-900">
                  Tell us about yourself
                </h2>
                <p className="mt-0.5 text-xs leading-5 text-neutral-500">
                  A genuine profile helps people choose the right companion.
                </p>
              </div>
            </div>
          </div>

          <form
            className="space-y-6 p-5 sm:p-7"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {/* Headline */}
            <div>
              <FormField
                label="Profile headline"
                placeholder="Friendly hiking buddy & weekend explorer"
                error={errors.headline?.message}
                {...register('headline')}
              />

              <p className="mt-1.5 text-xs text-neutral-400">
                Keep it short and let your personality come through.
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-neutral-800">
                About you
              </label>

              <textarea
                rows={6}
                placeholder="Tell people a little about yourself, your interests, and the kind of company you enjoy being for others."
                {...register('bio')}
                className={`mt-1.5 w-full resize-none rounded-xl border bg-white px-3.5 py-3 text-sm text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 focus:ring-4 ${
                  errors.bio
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-50'
                    : 'border-neutral-200 focus:border-brand-400 focus:ring-brand-50'
                }`}
              />

              {errors.bio ? (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.bio.message}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-neutral-400">
                  Talk about your interests, personality, hobbies, or activities
                  you enjoy.
                </p>
              )}
            </div>

            {/* Location */}
            <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-neutral-500 shadow-sm ring-1 ring-neutral-100">
                  <LocationIcon />
                </div>

                <div>
                  <p className="text-sm font-semibold text-neutral-800">
                    Your location
                  </p>
                  <p className="text-xs text-neutral-500">
                    Helps people discover companions nearby.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="City"
                  placeholder="e.g. Indore"
                  error={errors.city?.message}
                  {...register('city')}
                />

                <FormField
                  label="Area / neighborhood"
                  placeholder="Optional"
                  error={errors.area?.message}
                  {...register('area')}
                />
              </div>
            </div>

            {/* Verification info */}
            <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm">
                  <CheckIcon />
                </div>

                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    What happens next?
                  </p>

                  <ul className="mt-2 space-y-1.5 text-xs leading-5 text-neutral-600">
                    <li>• Your profile will be reviewed by our admin team.</li>
                    <li>• Once verified, you can add services and pricing.</li>
                    <li>• Then you'll set your availability for bookings.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Error */}
            {apiError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-700">
                  {apiError.response?.data?.message ||
                    'Something went wrong. Please try again.'}
                </p>
              </div>
            )}

            {/* Submit */}
            <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-neutral-400">
                You can update your profile later.
              </p>

              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Creating profile…
                  </>
                ) : (
                  <>
                    Create partner profile
                    <span className="ml-2">→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Bottom note */}
        <p className="mx-auto mt-5 max-w-lg text-center text-[11px] leading-5 text-neutral-400">
          SuperBuddy is for genuine, non-sexual companionship and
          activity-based experiences only.
        </p>
      </div>
    </div>
  );
}