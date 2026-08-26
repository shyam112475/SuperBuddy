import { useState } from 'react';
import { useSearchPartners, useServiceCategories } from './hooks';
import { PartnerCard } from './PartnerCard';
import { Button } from '../../components/Button';
import { Card, CardBody } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { cn } from '../../utils/cn';
import type { PartnerSearchFilters } from './types';

/**
 * ============================================================================
 * PREMIUM DISCOVER PARTNERS PAGE
 * ============================================================================
 * 
 * Features:
 * - Premium hero section
 * - Advanced search and filters
 * - Image-first partner cards
 * - Premium loading/empty/error states
 * - Responsive grid (1-2-3-4 columns)
 * - Smooth animations
 */
export function DiscoverPartnersPage() {
  const [filters, setFilters] = useState<PartnerSearchFilters>({ page: 1 });
  const [showFilters, setShowFilters] = useState(false);

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

  const hasActiveFilters =
    filters.search || filters.city || filters.serviceCategory;

  return (
    <div className="min-h-screen bg-neutral-0">
      {/* ========================================================================
          PREMIUM HERO SECTION
          ======================================================================== */}
      <section className="relative overflow-hidden bg-white border-b border-neutral-200">
        {/* Background gradients */}
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-brand-100/30 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-emerald-100/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="space-y-4 mb-8">
            <Badge variant="primary">Discover Companions</Badge>

            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900">
              Find someone to share the day with
            </h1>

            <p className="text-lg text-neutral-600 max-w-2xl">
              Discover verified companions for hikes, travel, events, conversations, 
              and everyday activities. Browse thousands of real people ready to connect.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================
          SEARCH & FILTERS SECTION
          ======================================================================== */}
      <section className="sticky top-16 sm:top-20 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          {/* Search Bar */}
          <div className="space-y-4">
            {/* Main search input */}
            <div>
              <Input
                type="text"
                placeholder="Search by name or skill..."
                icon={
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                  </svg>
                }
                onChange={(e) =>
                  updateFilter('search', e.target.value)
                }
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              {/* Location filter */}
              <Input
                type="text"
                placeholder="City or area..."
                icon="📍"
                className="flex-1"
                onChange={(e) =>
                  updateFilter('city', e.target.value)
                }
              />

              {/* Category filter */}
              <select
                value={filters.serviceCategory || ''}
                onChange={(e) =>
                  updateFilter(
                    'serviceCategory',
                    e.target.value as PartnerSearchFilters['serviceCategory']
                  )
                }
                className={cn(
                  'h-11 rounded-lg border-2 transition-all duration-200',
                  'bg-white text-neutral-900',
                  'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
                  'disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed',
                  'px-4 py-2 text-sm font-medium',
                  'border-neutral-300 hover:border-neutral-400'
                )}
              >
                <option value="">All activities</option>

                {categories?.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Clear filters button */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setFilters({ page: 1 })
                  }
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          MAIN CONTENT SECTION
          ======================================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Results Header */}
        {!isLoading && !isError && data && (
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                {data.items.length > 0 ? 'Verified Companions' : 'No Companions Found'}
              </h2>

              <p className="mt-1 text-neutral-600">
                {data.items.length > 0
                  ? `Showing ${data.items.length} companions`
                  : 'Try adjusting your filters or search term'}
              </p>
            </div>

            {data.pagination.totalPages > 1 && (
              <div className="text-sm text-neutral-500">
                Page {data.pagination.page} of {data.pagination.totalPages}
              </div>
            )}
          </div>
        )}

        {/* ===== LOADING STATE ===== */}
        {isLoading && (
          <div className="space-y-4">
            <p className="text-neutral-600 mb-6">
              Finding perfect companions for you...
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Card
                  key={i}
                  className="overflow-hidden"
                >
                  <div className="h-72 animate-pulse bg-neutral-200" />
                  <CardBody className="space-y-3">
                    <div className="h-4 bg-neutral-200 rounded animate-pulse" />
                    <div className="h-3 bg-neutral-200 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-neutral-200 rounded animate-pulse w-1/2" />
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ===== ERROR STATE ===== */}
        {isError && (
          <Card className="bg-red-50 border-red-200">
            <CardBody className="text-center space-y-4 py-12">
              <div className="text-4xl">😕</div>
              <div>
                <h3 className="text-lg font-bold text-red-900">
                  Couldn't load companions
                </h3>
                <p className="mt-1 text-red-700">
                  Please try again in a moment or adjust your filters.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </CardBody>
          </Card>
        )}

        {/* ===== EMPTY STATE ===== */}
        {data && data.items.length === 0 && (
          <Card className="bg-neutral-50 border-neutral-200">
            <CardBody className="text-center space-y-4 py-16">
              <div className="text-5xl">🔍</div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-900">
                  No companions found
                </h3>
                <p className="mt-2 text-neutral-600 max-w-md mx-auto">
                  {hasActiveFilters
                    ? 'Try changing your city, activity, or search term to find more companions.'
                    : 'Be the first to browse available companions. Check back soon!'}
                </p>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="primary"
                  onClick={() => setFilters({ page: 1 })}
                >
                  Clear Filters
                </Button>
              )}
            </CardBody>
          </Card>
        )}

        {/* ===== RESULTS GRID ===== */}
        {data && data.items.length > 0 && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.items.map((partner) => (
                <PartnerCard
                  key={partner.id}
                  partner={partner}
                />
              ))}
            </div>

            {/* ===== PAGINATION ===== */}
            {data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-8 border-t border-neutral-200">
                <Button
                  variant="outline"
                  disabled={data.pagination.page <= 1}
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      page: (f.page ?? 1) - 1,
                    }))
                  }
                >
                  ← Previous
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({
                    length: Math.min(5, data.pagination.totalPages),
                  }).map((_, i) => {
                    const pageNum =
                      Math.max(
                        1,
                        data.pagination.page -
                          Math.floor(5 / 2)
                      ) + i;

                    if (pageNum > data.pagination.totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() =>
                          setFilters((f) => ({
                            ...f,
                            page: pageNum,
                          }))
                        }
                        className={cn(
                          'h-10 w-10 rounded-lg font-medium transition-all',
                          pageNum === data.pagination.page
                            ? 'bg-brand-600 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
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
                >
                  Next →
                </Button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
