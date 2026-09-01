import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { createBookingFormSchema, type CreateBookingFormValues } from './schemas';
import { useCreateBooking } from './hooks';
import { Card, CardBody } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { cn } from '../../utils/cn';
import type { AxiosError } from 'axios';

/**
 * ============================================================================
 * PREMIUM BOOKING FORM - Streamlined, frictionless booking experience
 * ============================================================================
 * 
 * Features:
 * - Minimal, focused design
 * - Step-by-step guidance
 * - Premium form fields (using Input component)
 * - Clear error messaging
 * - Success confirmation
 * - Loading state with animation
 */
export function CreateBookingForm({
  partnerId,
  serviceId,
  onSuccess,
}: {
  partnerId: string;
  serviceId: string;
  onSuccess?: () => void;
}) {
  const navigate = useNavigate();
  const { mutate, isPending, error, isSuccess } = useCreateBooking();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateBookingFormValues>({
    resolver: zodResolver(createBookingFormSchema),
  });

  const selectedDate = watch('date');
  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const apiError = error as AxiosError<{ message: string }> | null;

  function onSubmit(values: CreateBookingFormValues) {
    mutate(
      {
        partnerId,
        serviceId,
        activityDescription: values.activityDescription,
        scheduledStart: new Date(`${values.date}T${values.startTime}`).toISOString(),
        scheduledEnd: new Date(`${values.date}T${values.endTime}`).toISOString(),
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            onSuccess?.();
            navigate('/bookings');
          }, 1500);
        },
      }
    );
  }

  // ========================================================================
  // SUCCESS STATE
  // ========================================================================
  if (isSuccess) {
    return (
      <Card>
        <CardBody className="text-center space-y-4 py-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100">
            <span className="text-3xl">✓</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              Booking Request Sent!
            </h2>

            <p className="mt-2 text-neutral-600 max-w-md">
              Your companion will review your request shortly. You'll receive a notification 
              once they respond.
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-neutral-500">
              Redirecting to your bookings...
            </p>

            <div className="h-1 w-full bg-neutral-200 rounded-full overflow-hidden">
              <div className="h-full bg-brand-600 animate-[width_1.5s_ease-in-out]" style={{ width: '100%' }} />
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  // ========================================================================
  // RENDER: PREMIUM BOOKING FORM
  // ========================================================================
  return (
    <div className="space-y-6">
      {/* ====================================================================
          FORM HEADER
          ==================================================================== */}
      <div className="space-y-2">
        <Badge variant="primary" size="sm">
          Step-by-step booking
        </Badge>

        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          Request a Booking
        </h2>

        <p className="text-neutral-600">
          Tell your companion when and where you'd like to meet. They'll confirm 
          availability and get back to you.
        </p>
      </div>

      {/* ====================================================================
          BOOKING FORM
          ==================================================================== */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* ================================================================
            SECTION 1: ACTIVITY DESCRIPTION
            ================================================================ */}
        <Card>
          <CardBody className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">
                What are you planning?
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                Give your companion more context about the activity
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Activity Details
              </label>

              <textarea
                {...register('activityDescription')}
                placeholder="E.g., 'Hiking to Waterfall Trail with photography stops'"
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-2 transition-all',
                  'bg-white text-neutral-900',
                  'placeholder:text-neutral-400',
                  'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
                  'resize-vertical min-h-[100px]',
                  errors.activityDescription
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-neutral-300 hover:border-neutral-400'
                )}
              />

              {errors.activityDescription && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  {errors.activityDescription.message}
                </p>
              )}

              <p className="mt-2 text-xs text-neutral-500">
                Share your interests and any special requests
              </p>
            </div>
          </CardBody>
        </Card>

        {/* ================================================================
            SECTION 2: DATE & TIME
            ================================================================ */}
        <Card>
          <CardBody className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">
                When would you like to meet?
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                Choose a date and time that works for you
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  📅 Date
                </label>

                <input
                  type="date"
                  {...register('date')}
                  min={new Date().toISOString().split('T')[0]}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border-2 transition-all',
                    'bg-white text-neutral-900 font-medium',
                    'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
                    errors.date
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-neutral-300 hover:border-neutral-400'
                  )}
                />

                {errors.date && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.date.message}
                  </p>
                )}
              </div>

              {/* Time Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Start Time */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    🕐 Start Time
                  </label>

                  <input
                    type="time"
                    {...register('startTime')}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border-2 transition-all',
                      'bg-white text-neutral-900 font-medium',
                      'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
                      errors.startTime
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-neutral-300 hover:border-neutral-400'
                    )}
                  />

                  {errors.startTime && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      {errors.startTime.message}
                    </p>
                  )}
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    🕐 End Time
                  </label>

                  <input
                    type="time"
                    {...register('endTime')}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border-2 transition-all',
                      'bg-white text-neutral-900 font-medium',
                      'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
                      errors.endTime
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-neutral-300 hover:border-neutral-400'
                    )}
                  />

                  {errors.endTime && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      {errors.endTime.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Summary */}
              {selectedDate && startTime && endTime && (
                <div className="rounded-lg bg-brand-50 border border-brand-200 p-4">
                  <p className="text-sm font-medium text-neutral-700">
                    📍 <span className="font-bold">{selectedDate}</span> from <span className="font-bold">{startTime}</span> to <span className="font-bold">{endTime}</span>
                  </p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* ================================================================
            ERROR STATE
            ================================================================ */}
        {apiError && (
          <Card className="border-red-200 bg-red-50">
            <CardBody className="flex gap-3">
              <span className="text-2xl shrink-0">⚠️</span>
              <div>
                <p className="font-bold text-red-900">
                  Unable to send booking
                </p>
                <p className="text-sm text-red-800 mt-1">
                  {apiError.response?.data?.message || 'Please try again'}
                </p>
              </div>
            </CardBody>
          </Card>
        )}

        {/* ================================================================
            TRUST & SAFETY INFO
            ================================================================ */}
        <Card className="bg-neutral-50 border-neutral-200">
          <CardBody className="space-y-3">
            <div className="flex gap-3">
              <span className="text-lg shrink-0">🛡️</span>
              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  Your booking is protected
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  All conversations stay in-app. Payment only after confirmation.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* ================================================================
            SUBMIT BUTTONS
            ================================================================ */}
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Button
            variant="outline"
            fullWidth
            type="button"
            onClick={onSuccess}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            type="submit"
            isLoading={isPending}
            disabled={isPending}
          >
            {isPending ? 'Sending Request...' : 'Send Booking Request'}
          </Button>
        </div>

        {/* ================================================================
            FOOTER TEXT
            ================================================================ */}
        <div className="text-center space-y-2 pt-4 border-t border-neutral-200">
          <p className="text-sm text-neutral-600">
            By requesting this booking, you agree to our Terms of Service
          </p>
          <p className="text-xs text-neutral-500">
            Your message will be sent to your companion immediately
          </p>
        </div>
      </form>
    </div>
  );
}
