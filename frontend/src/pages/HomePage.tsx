import { useHealthCheck } from '../hooks/useHealthCheck';

export function HomePage() {
  const { data, isLoading, isError, error } = useHealthCheck();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-neutral-900">
        Find a companion for whatever's next.
      </h1>
      <p className="mt-3 max-w-xl text-neutral-600">
        Hiking partners, travel companions, plus-ones, and more — verified people
        for legitimate, non-sexual activities and social occasions.
      </p>

      <div className="mt-10 rounded-lg border border-neutral-200 bg-white p-4 text-sm">
        <span className="font-medium text-neutral-700">API status: </span>
        {isLoading && <span className="text-neutral-500">checking…</span>}
        {isError && (
          <span className="text-red-600">
            unreachable ({error instanceof Error ? error.message : 'unknown error'})
          </span>
        )}
        {data && (
          <span className="text-green-600">
            {data.data.status} — {data.message}
          </span>
        )}
      </div>
    </div>
  );
}
