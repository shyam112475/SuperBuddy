import { useState } from 'react';
import { useSetAvailability } from './hooks';
import type { AvailabilitySlot, DayOfWeek, PublicPartner } from './types';

const DAYS: { value: DayOfWeek; label: string; short: string }[] = [
  { value: 'MONDAY', label: 'Monday', short: 'Mon' },
  { value: 'TUESDAY', label: 'Tuesday', short: 'Tue' },
  { value: 'WEDNESDAY', label: 'Wednesday', short: 'Wed' },
  { value: 'THURSDAY', label: 'Thursday', short: 'Thu' },
  { value: 'FRIDAY', label: 'Friday', short: 'Fri' },
  { value: 'SATURDAY', label: 'Saturday', short: 'Sat' },
  { value: 'SUNDAY', label: 'Sunday', short: 'Sun' },
];

const DEFAULT_START = '09:00';
const DEFAULT_END = '17:00';

export function ManageAvailabilitySection({
  profile,
}: {
  profile: PublicPartner;
}) {
  const { mutate, isPending, isSuccess } = useSetAvailability();

  const [slots, setSlots] = useState<
    Record<
      DayOfWeek,
      {
        enabled: boolean;
        start: string;
        end: string;
      }
    >
  >(() =>
    DAYS.reduce(
      (acc, { value }) => {
        const existing = profile.availability.find(
          (s) => s.dayOfWeek === value
        );

        acc[value] = {
          enabled: Boolean(existing),
          start: existing?.startTime ?? DEFAULT_START,
          end: existing?.endTime ?? DEFAULT_END,
        };

        return acc;
      },
      {} as Record<
        DayOfWeek,
        {
          enabled: boolean;
          start: string;
          end: string;
        }
      >
    )
  );

  function toggleDay(day: DayOfWeek) {
    setSlots((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
  }

  function updateTime(
    day: DayOfWeek,
    field: 'start' | 'end',
    value: string
  ) {
    setSlots((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  }

  function handleSave() {
    const payload: AvailabilitySlot[] = DAYS.filter(
      ({ value }) => slots[value].enabled
    ).map(({ value }) => ({
      dayOfWeek: value,
      startTime: slots[value].start,
      endTime: slots[value].end,
    }));

    mutate(payload);
  }

  const activeDays = DAYS.filter(({ value }) => slots[value].enabled).length;

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-neutral-100 bg-gradient-to-r from-brand-50 to-white px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="17"
                  rx="2"
                />
                <path d="M16 2v4M8 2v4M3 10h18" />
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
              </svg>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                Weekly availability
              </h2>

              <p className="mt-0.5 max-w-xl text-sm leading-5 text-neutral-600">
                Let people know when you're generally available for
                companionship and activities.
              </p>
            </div>
          </div>

          <div className="hidden rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 sm:block">
            {activeDays} {activeDays === 1 ? 'day' : 'days'} active
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="p-4 sm:p-6">
        <div className="space-y-2">
          {DAYS.map(({ value, label }) => {
            const slot = slots[value];

            return (
              <div
                key={value}
                className={`rounded-xl border transition-all ${
                  slot.enabled
                    ? 'border-brand-200 bg-brand-50/50'
                    : 'border-neutral-100 bg-neutral-50/60 hover:border-neutral-200'
                }`}
              >
                <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-3.5">
                  {/* Day toggle */}
                  <button
                    type="button"
                    onClick={() => toggleDay(value)}
                    className="flex min-w-[145px] items-center gap-3 text-left"
                  >
                    <span
                      className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                        slot.enabled
                          ? 'border-brand-600 bg-brand-600'
                          : 'border-neutral-300 bg-white'
                      }`}
                    >
                      {slot.enabled && (
                        <svg
                          className="h-3.5 w-3.5 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 5.29a1 1 0 010 1.42l-7.2 7.2a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.416-1.42l2.794 2.795 6.494-6.495a1 1 0 011.416 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>

                    <span>
                      <span className="block text-sm font-medium text-neutral-900 sm:hidden">
                        {label}
                      </span>

                      <span className="hidden text-sm font-medium text-neutral-900 sm:block">
                        {label}
                      </span>

                      <span className="block text-[11px] text-neutral-400 sm:hidden">
                        {slot.enabled ? 'Available' : 'Unavailable'}
                      </span>
                    </span>
                  </button>

                  {/* Time */}
                  {slot.enabled ? (
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <label className="sr-only">Start time for {label}</label>
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) =>
                            updateTime(value, 'start', e.target.value)
                          }
                          className="rounded-lg border border-neutral-200 bg-white px-2.5 py-2 text-sm font-medium text-neutral-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                        />
                      </div>

                      <span className="text-xs font-medium text-neutral-400">
                        to
                      </span>

                      <div className="relative">
                        <label className="sr-only">End time for {label}</label>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) =>
                            updateTime(value, 'end', e.target.value)
                          }
                          className="rounded-lg border border-neutral-200 bg-white px-2.5 py-2 text-sm font-medium text-neutral-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-neutral-400">
                      Not available
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile summary */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3 sm:hidden">
          <span className="text-xs text-neutral-500">
            Availability set for
          </span>
          <span className="text-sm font-semibold text-neutral-800">
            {activeDays} {activeDays === 1 ? 'day' : 'days'}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-5 flex flex-col gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-neutral-500">
            This is your recurring weekly schedule. Exact availability can
            still vary for individual bookings.
          </p>

          <div className="flex items-center gap-3">
            {isSuccess && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 5.29a1 1 0 010 1.42l-7.2 7.2a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.416-1.42l2.794 2.795 6.494-6.495a1 1 0 011.416 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Saved
              </span>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending && (
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="opacity-30"
                  />
                  <path
                    d="M21 12a9 9 0 00-9-9"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              )}

              {isPending ? 'Saving...' : 'Save availability'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}