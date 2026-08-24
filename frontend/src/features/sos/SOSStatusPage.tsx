import { useParams, Link } from 'react-router-dom';
import { useResolveSOS, useSOSAlert } from './hooks';

export function SOSStatusPage() {
  const { id } = useParams<{ id: string }>();
  const { data: alert, isLoading, isError } = useSOSAlert(id);
  const { mutate: resolve, isPending } = useResolveSOS();

  if (isLoading) {
    return <div className="mx-auto max-w-lg px-6 py-16 text-sm text-neutral-500">Loading…</div>;
  }

  if (isError || !alert) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <p className="text-sm text-neutral-600">This alert couldn't be found.</p>
        <Link to="/bookings" className="mt-3 inline-block text-sm text-brand-600 hover:underline">
          Back to bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <div
        className={`rounded-lg border p-4 ${
          alert.status === 'ACTIVE' ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
        }`}
      >
        <h1 className="text-lg font-bold">
          {alert.status === 'ACTIVE' ? '🆘 SOS Alert Active' : 'Alert Resolved'}
        </h1>
        <p className="mt-1 text-sm">
          {alert.status === 'ACTIVE'
            ? 'CompanionHub admins have been notified with your location.'
            : `Marked as ${alert.status === 'FALSE_ALARM' ? 'a false alarm' : 'resolved'}.`}
        </p>
      </div>

      <div className="mt-6 space-y-2 text-sm text-neutral-700">
        <p>
          <span className="font-medium">Location:</span> {alert.latitude.toFixed(5)},{' '}
          {alert.longitude.toFixed(5)}
        </p>
        {alert.description && (
          <p>
            <span className="font-medium">Description:</span> {alert.description}
          </p>
        )}
        <p>
          <span className="font-medium">Triggered:</span>{' '}
          {new Date(alert.createdAt).toLocaleString()}
        </p>
        {alert.resolvedAt && (
          <p>
            <span className="font-medium">Resolved:</span>{' '}
            {new Date(alert.resolvedAt).toLocaleString()}
          </p>
        )}
        {alert.resolutionNote && (
          <p>
            <span className="font-medium">Note:</span> {alert.resolutionNote}
          </p>
        )}
      </div>

      {alert.status === 'ACTIVE' && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => resolve({ id: alert.id, status: 'RESOLVED' })}
            disabled={isPending}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
          >
            I'm safe — mark resolved
          </button>
          <button
            onClick={() => resolve({ id: alert.id, status: 'FALSE_ALARM' })}
            disabled={isPending}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            This was a false alarm
          </button>
        </div>
      )}
    </div>
  );
}
