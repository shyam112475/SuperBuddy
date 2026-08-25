import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTriggerSOS } from './hooks';

export function SOSButton({ bookingId }: { bookingId?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [description, setDescription] = useState('');
  const [locationError, setLocationError] = useState<string | null>(null);

  const { mutate, isPending, error } = useTriggerSOS();
  const navigate = useNavigate();

  function handleTrigger() {
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError(
        'Location is not available on this device or browser.'
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        mutate(
          {
            bookingId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            description: description.trim() || undefined,
          },
          {
            onSuccess: (alert) => {
              navigate(`/sos/${alert.id}`);
            },
          }
        );
      },
      () => {
        setLocationError(
          'Location access is required to send an SOS alert. Please allow location access and try again.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[11px]">
          !
        </span>

        SOS / Emergency
      </button>
    );
  }

  return (
    <div className="w-full max-w-xl overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-red-100 bg-red-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4"
              />
              <path
                strokeLinecap="round"
                d="M12 16.5h.01"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3l9 18H3L12 3z"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-sm font-bold text-red-800">
              Emergency SOS
            </h3>

            <p className="mt-1 text-xs leading-5 text-red-700">
              Use SOS only if you feel unsafe or need immediate
              assistance.
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Warning */}
        <div className="rounded-lg border border-red-100 bg-red-50/60 px-4 py-3">
          <p className="text-xs font-semibold leading-5 text-red-800">
            This will immediately alert SuperBuddy admins
            {bookingId
              ? ' and the other person on this booking'
              : ''}
            .
          </p>

          <p className="mt-1 text-xs leading-5 text-red-700">
            Your current GPS location will be included with the
            emergency alert.
          </p>
        </div>

        {/* Location indicator */}
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-neutral-600 shadow-sm">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21s7-6.1 7-12a7 7 0 10-14 0c0 5.9 7 12 7 12z"
              />

              <circle cx="12" cy="9" r="2.2" />
            </svg>
          </div>

          <div>
            <p className="text-xs font-semibold text-neutral-800">
              Location sharing required
            </p>

            <p className="mt-0.5 text-[11px] text-neutral-500">
              Your browser will ask for location permission.
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <label
            htmlFor="sos-description"
            className="block text-xs font-semibold text-neutral-700"
          >
            What is happening?
            <span className="ml-1 font-normal text-neutral-400">
              Optional
            </span>
          </label>

          <textarea
            id="sos-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
            placeholder="Briefly describe the situation so our team knows how to help."
            className="mt-1.5 w-full resize-none rounded-lg border border-neutral-300 px-3 py-2 text-sm leading-6 text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-neutral-50"
          />
        </div>

        {/* Location error */}
        {locationError && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
            <p className="text-xs font-medium leading-5 text-red-700">
              {locationError}
            </p>
          </div>
        )}

        {/* API error */}
        {error && !locationError && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
            <p className="text-xs font-medium text-red-700">
              Something went wrong while sending the SOS. Please try
              again.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setExpanded(false);
              setDescription('');
              setLocationError(null);
            }}
            disabled={isPending}
            className="rounded-lg px-4 py-2 text-xs font-medium text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleTrigger}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    className="opacity-30"
                    stroke="currentColor"
                    strokeWidth="3"
                  />

                  <path
                    d="M21 12a9 9 0 00-9-9"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>

                Sending SOS…
              </>
            ) : (
              <>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                  !
                </span>

                Send SOS now
              </>
            )}
          </button>
        </div>

        {/* Footer note */}
        <p className="mt-4 text-center text-[11px] leading-4 text-neutral-400">
          If you are in immediate physical danger, contact local
          emergency services as well.
        </p>
      </div>
    </div>
  );
}