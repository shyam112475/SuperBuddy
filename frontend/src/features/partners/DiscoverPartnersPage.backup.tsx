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
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      page: 1,
    }));
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 px-6 py-8 text-white shadow-lg sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-brand-100">
              SuperBuddy
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Find someone to share the day with.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-brand-100 sm:text-base">
              Discover verified companions for hikes, travel, events,
              conversations and everyday activities.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="relative z-10 -mt-5 mx-2 rounded-2xl border border-neutral-200 bg-white p-4 shadow-lg sm:mx-6 sm:p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.5fr_1fr_1fr]">

            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

              <input
                type="text"
                placeholder="Search companions or activities..."
                className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-3 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
                onChange={(e) =>
                  updateFilter('search', e.target.value)
                }
              />
            </div>

            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s7-5.25 7-11a7 7 0 10-14 0c0 5.75 7 11 7 11z"
                />
                <circle cx="12" cy="10" r="2.2" />
              </svg>

              <input
                type="text"
                placeholder="City"
                className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-3 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
                onChange={(e) =>
                  updateFilter('city', e.target.value)
                }
              />
            </div>

            <select
              className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-700 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
              onChange={(e) =>
                updateFilter(
                  'serviceCategory',
                  e.target.value as PartnerSearchFilters['serviceCategory']
                )
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
        </div>

        {/* Results */}
        <div className="mt-8">

          {!isLoading && !isError && data && (
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Verified companions
                </h2>

                <p className="mt-0.5 text-sm text-neutral-500">
                  {data.items.length > 0
                    ? `Showing ${data.items.length} companions`
                    : 'No companions found'}
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-2xl border border-neutral-200 bg-white"
                />
              ))}
            </div>
          )}

          {isError && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
              <p className="font-medium text-red-700">
                Couldn't load companions
              </p>
              <p className="mt-1 text-sm text-red-600">
                Please try again in a moment.
              </p>
            </div>
          )}

          {data && data.items.length === 0 && (
            <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                <svg
                  className="h-6 w-6 text-neutral-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
              </div>

              <h3 className="mt-4 font-semibold text-neutral-900">
                No companions found
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-sm text-neutral-500">
                Try changing your city, activity or search term.
              </p>
            </div>
          )}

          {data && data.items.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {data.items.map((partner) => (
                  <PartnerCard
                    key={partner.id}
                    partner={partner}
                  />
                ))}
              </div>

              {data.pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    disabled={data.pagination.page <= 1}
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        page: (f.page ?? 1) - 1,
                      }))
                    }
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ← Previous
                  </button>

                  <span className="rounded-xl bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-600">
                    {data.pagination.page} / {data.pagination.totalPages}
                  </span>

                  <button
                    disabled={
                      data.pagination.page >=
                      data.pagination.totalPages
                    }
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        page: (f.page ?? 1) + 1,
                      }))
                    }
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}