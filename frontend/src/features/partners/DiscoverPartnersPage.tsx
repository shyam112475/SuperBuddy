import { useState } from 'react';
import { useSearchPartners, useServiceCategories } from './hooks';
import { PartnerCard } from './PartnerCard';
import type { PartnerSearchFilters } from './types';

export function DiscoverPartnersPage() {
  const [filters, setFilters] = useState<PartnerSearchFilters>({ page: 1 });
  const { data, isLoading, isError } = useSearchPartners(filters);
  const { data: categories } = useServiceCategories();

  function updateFilter<K extends keyof PartnerSearchFilters>(
    key: K,
    value: PartnerSearchFilters[K]
  ) {
    setFilters((prev) => ({ ...prev, [key]: value || undefined, page: 1 }));
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">Find a companion</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Verified people for hiking, travel, events, and other non-sexual activities.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by keyword…"
          className="w-64 rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          onChange={(e) => updateFilter('search', e.target.value)}
        />
        <input
          type="text"
          placeholder="City"
          className="w-40 rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          onChange={(e) => updateFilter('city', e.target.value)}
        />
        <select
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          onChange={(e) =>
            updateFilter('serviceCategory', e.target.value as PartnerSearchFilters['serviceCategory'])
          }
        >
          <option value="">All activities</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        {isLoading && <p className="text-sm text-neutral-500">Loading…</p>}
        {isError && <p className="text-sm text-red-600">Couldn't load partners. Try again.</p>}

        {data && data.items.length === 0 && (
          <p className="text-sm text-neutral-500">No partners match those filters yet.</p>
        )}

        {data && data.items.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {data.items.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>

            {data.pagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-3 text-sm">
                <button
                  disabled={data.pagination.page <= 1}
                  onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
                  className="rounded-md border border-neutral-300 px-3 py-1.5 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-neutral-500">
                  Page {data.pagination.page} of {data.pagination.totalPages}
                </span>
                <button
                  disabled={data.pagination.page >= data.pagination.totalPages}
                  onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
                  className="rounded-md border border-neutral-300 px-3 py-1.5 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
