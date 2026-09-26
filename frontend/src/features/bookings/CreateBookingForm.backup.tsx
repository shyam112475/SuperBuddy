import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  createBookingFormSchema,
  type CreateBookingFormValues,
} from './schemas';
import { useCreateBooking } from './hooks';
import type { AxiosError } from 'axios';

export function CreateBookingForm({
  partnerProfileId,
  offeringId,
  offeringLabel,
  onDone,
}: {
  partnerProfileId: string;
  offeringId: string;
  offeringLabel: string;
  onDone: () => void;
}) {
  const navigate = useNavigate();
  const { mutate, isPending, error, isSuccess } = useCreateBooking();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBookingFormValues>({
    resolver: zodResolver(createBookingFormSchema),
  });

  const apiError = error as AxiosError<{ message: string }> | null;

  function onSubmit(values: CreateBookingFormValues) {
    mutate(
      {
        partnerProfileId,
        offeringId,
        activityDescription: values.activityDescription,
        scheduledStart: new Date(
          `${values.date}T${values.startTime}`,
        ).toISOString(),
        scheduledEnd: new Date(
          `${values.date}T${values.endTime}`,
        ).toISOString(),
      },
      {
        onSuccess: () => {
          setTimeout(() => navigate('/bookings'), 1200);
        },
      },
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-brand-100 bg-gradient-to-r from-brand-50 to-white px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">
              New booking request
            </p>

            <h3 className="mt-1 text-lg font-semibold text-neutral-900">
              {offeringLabel}
            </h3>

            <p className="mt-1 text-xs text-neutral-500">
              Choose a time and tell your companion what you have planned.
            </p>
          </div>

          <button
            type="button"
            onClick={onDone}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Cancel booking request"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <form
        className="space-y-5 p-5"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* Activity description */}
        <div>
          <label className="block text-sm font-semibold text-neutral-800">
            What's the plan?
          </label>

          <p className="mt-1 text-xs text-neutral-500">
            Give your companion a little context about the activity.
          </p>

          <textarea
            rows={4}
            className={`mt-2 w-full resize-none rounded-xl border bg-white px-3.5 py-3 text-sm text-neutral-800 outline-none transition-all placeholder:text-neutral-400 ${
              errors.activityDescription
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                : 'border-neutral-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'
            }`}
            placeholder="e.g. Saturday morning hike at Sunset Ridge, back by lunch"
            {...register('activityDescription')}
          />

          {errors.activityDescription && (
            <p className="mt-1.5 text-xs font-medium text-red-600">
              {errors.activityDescription.message}
            </p>
          )}
        </div>

        {/* Schedule */}
        <div>
          <div className="mb-2">
            <label className="text-sm font-semibold text-neutral-800">
              When would you like to meet?
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Date */}
            <div>
              <label className="block text-xs font-medium text-neutral-600">
                Date
              </label>

              <input
                type="date"
                className={`mt-1.5 w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-neutral-700 outline-none transition-all ${
                  errors.date
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                    : 'border-neutral-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'
                }`}
                {...register('date')}
              />

              {errors.date && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Start */}
            <div>
              <label className="block text-xs font-medium text-neutral-600">
                Start time
              </label>

              <input
                type="time"
                className={`mt-1.5 w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-neutral-700 outline-none transition-all ${
                  errors.startTime
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                    : 'border-neutral-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'
                }`}
                {...register('startTime')}
              />

              {errors.startTime && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {errors.startTime.message}
                </p>
              )}
            </div>

            {/* End */}
            <div>
              <label className="block text-xs font-medium text-neutral-600">
                End time
              </label>

              <input
                type="time"
                className={`mt-1.5 w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-neutral-700 outline-none transition-all ${
                  errors.endTime
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                    : 'border-neutral-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'
                }`}
                {...register('endTime')}
              />

              {errors.endTime && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="flex gap-3 rounded-xl border border-red-100 bg-red-50 px-3.5 py-3">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
            </svg>

            <p className="text-sm text-red-700">
              {apiError.response?.data?.message ||
                'Something went wrong. Please try again.'}
            </p>
          </div>
        )}

        {/* Success */}
        {isSuccess && (
          <div className="flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3.5 py-3">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M5 12.5l4.5 4.5L19 7.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p className="text-sm font-medium text-emerald-700">
              Request sent! Taking you to your bookings…
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onDone}
            className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? 'Sending request…' : 'Send booking request'}
          </button>
        </div>
      </form>
    </div>
  );
}