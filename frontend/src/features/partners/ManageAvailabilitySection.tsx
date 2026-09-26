import { useState } from 'react';
import { useSetAvailability } from './hooks';
import type { AvailabilitySlot, DayOfWeek, PublicPartner } from './types';

const DAYS: { value: DayOfWeek; label: string }[] = [
  { value: 'MONDAY', label: 'Mon' },
  { value: 'TUESDAY', label: 'Tue' },
  { value: 'WEDNESDAY', label: 'Wed' },
  { value: 'THURSDAY', label: 'Thu' },
  { value: 'FRIDAY', label: 'Fri' },
  { value: 'SATURDAY', label: 'Sat' },
  { value: 'SUNDAY', label: 'Sun' },
];

const DEFAULT_START = '09:00';
const DEFAULT_END = '17:00';

export function ManageAvailabilitySection({ profile }: { profile: PublicPartner }) {
  const { mutate, isPending, isSuccess } = useSetAvailability();

  const [slots, setSlots] = useState<Record<DayOfWeek, { enabled: boolean; start: string; end: string }>>(
    () =>
      DAYS.reduce(
        (acc, { value }) => {
          const existing = profile.availability.find((s) => s.dayOfWeek === value);
          acc[value] = {
            enabled: Boolean(existing),
            start: existing?.startTime ?? DEFAULT_START,
            end: existing?.endTime ?? DEFAULT_END,
          };
          return acc;
        },
        {} as Record<DayOfWeek, { enabled: boolean; start: string; end: string }>
      )
  );

  function toggleDay(day: DayOfWeek) {
    setSlots((prev) => ({ ...prev, [day]: { ...prev[day], enabled: !prev[day].enabled } }));
  }

  function updateTime(day: DayOfWeek, field: 'start' | 'end', value: string) {
    setSlots((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  }

  function handleSave() {
    const payload: AvailabilitySlot[] = DAYS.filter(({ value }) => slots[value].enabled).map(
      ({ value }) => ({
        dayOfWeek: value,
        startTime: slots[value].start,
        endTime: slots[value].end,
      })
    );
    mutate(payload);
  }

  return (
    <section className="border-t border-neutral-200 pt-8">
      <h2 className="text-lg font-semibold text-neutral-900">Weekly availability</h2>
      <p className="mt-1 text-sm text-neutral-600">
        A rough recurring schedule people can filter by — exact booking times come later.
      </p>

      <div className="mt-4 space-y-2">
        {DAYS.map(({ value, label }) => (
          <div key={value} className="flex items-center gap-3">
            <label className="flex w-24 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={slots[value].enabled}
                onChange={() => toggleDay(value)}
                className="rounded border-neutral-300"
              />
              {label}
            </label>
            {slots[value].enabled && (
              <>
                <input
                  type="time"
                  value={slots[value].start}
                  onChange={(e) => updateTime(value, 'start', e.target.value)}
                  className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
                />
                <span className="text-neutral-400">–</span>
                <input
                  type="time"
                  value={slots[value].end}
                  onChange={(e) => updateTime(value, 'end', e.target.value)}
                  className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
                />
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {isPending ? 'Saving…' : 'Save availability'}
        </button>
        {isSuccess && <span className="text-sm text-green-600">Saved.</span>}
      </div>
    </section>
  );
}
