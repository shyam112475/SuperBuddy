import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { createBookingFormSchema, type CreateBookingFormValues } from './schemas';
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
  } = useForm<CreateBookingFormValues>({ resolver: zodResolver(createBookingFormSchema) });

  const apiError = error as AxiosError<{ message: string }> | null;

  function onSubmit(values: CreateBookingFormValues) {
    mutate(
      {
        partnerProfileId,
        offeringId,
        activityDescription: values.activityDescription,
        scheduledStart: new Date(`${values.date}T${values.startTime}`).toISOString(),
        scheduledEnd: new Date(`${values.date}T${values.endTime}`).toISOString(),
      },
      {
        onSuccess: () => {
          setTimeout(() => navigate('/bookings'), 1200);
        },
      }
    );
  }

  return (
    <div className="rounded-lg border border-brand-200 bg-brand-50/40 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-neutral-900">Request: {offeringLabel}</h3>
        <button onClick={onDone} className="text-xs text-neutral-500 hover:underline">
          Cancel
        </button>
      </div>

      <form className="mt-3 space-y-3" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="block text-xs font-medium text-neutral-700">
            What's the plan?
          </label>
          <textarea
            rows={3}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="e.g. Saturday morning hike at Sunset Ridge, back by lunch"
            {...register('activityDescription')}
          />
          {errors.activityDescription && (
            <p className="mt-1 text-xs text-red-600">{errors.activityDescription.message}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-700">Date</label>
            <input
              type="date"
              className="mt-1 rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
              {...register('date')}
            />
            {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700">Start</label>
            <input
              type="time"
              className="mt-1 rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
              {...register('startTime')}
            />
            {errors.startTime && (
              <p className="mt-1 text-xs text-red-600">{errors.startTime.message}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700">End</label>
            <input
              type="time"
              className="mt-1 rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
              {...register('endTime')}
            />
            {errors.endTime && (
              <p className="mt-1 text-xs text-red-600">{errors.endTime.message}</p>
            )}
          </div>
        </div>

        {apiError && (
          <p className="text-sm text-red-600">
            {apiError.response?.data?.message || 'Something went wrong. Please try again.'}
          </p>
        )}
        {isSuccess && (
          <p className="text-sm text-green-600">Request sent! Taking you to your bookings…</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {isPending ? 'Sending…' : 'Send request'}
        </button>
      </form>
    </div>
  );
}
