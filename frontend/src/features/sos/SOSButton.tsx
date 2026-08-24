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
      setLocationError('Location is not available on this device or browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        mutate(
          {
            bookingId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            description: description || undefined,
          },
          {
            onSuccess: (alert) => navigate(`/sos/${alert.id}`),
          }
        );
      },
      () => {
        setLocationError(
          'Location access is required to send an SOS alert. Please allow location access and try again.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
      >
        🆘 SOS
      </button>
    );
  }

  return (
    <div className="rounded-md border border-red-300 bg-red-50 p-3 text-xs">
      <p className="font-semibold text-red-800">
        This will immediately alert CompanionHub admins{bookingId ? ' and the other person on this booking' : ''} with your current location.
      </p>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What's happening? (optional)"
        className="mt-2 w-full rounded-md border border-red-300 px-2 py-1.5 text-xs"
      />
      {locationError && <p className="mt-1 text-red-700">{locationError}</p>}
      {error && <p className="mt-1 text-red-700">Something went wrong. Please try again.</p>}
      <div className="mt-2 flex gap-2">
        <button
          onClick={handleTrigger}
          disabled={isPending}
          className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {isPending ? 'Sending…' : 'Send SOS now'}
        </button>
        <button
          onClick={() => setExpanded(false)}
          disabled={isPending}
          className="text-neutral-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
