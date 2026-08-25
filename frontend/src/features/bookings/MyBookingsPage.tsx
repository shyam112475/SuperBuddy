import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useListBookings } from './hooks';
import { BookingCard } from './BookingCard';
import type { ListBookingsFilters } from './types';

export function MyBookingsPage() {
  const user = useAuthStore((s) => s.user);
  const isPartner = user?.role === 'PARTNER';
  const [tab, setTab] = useState<'customer' | 'partner'>('customer');

  const filters: ListBookingsFilters = { as: tab };
  const { data, isLoading, isError } = useListBookings(filters);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
              SuperBuddy
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900">
              My Bookings
            </h1>

            <p className="mt-1.5 text-sm text-neutral-500">
              Manage your upcoming and previous companionship activities.
            </p>
          </div>

          {data && (
            <div className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-neutral-500 shadow-sm ring-1 ring-neutral-200">
              {data.items.length}{' '}
              {data.items.length === 1 ? 'booking' : 'bookings'}
            </div>
          )}
        </div>

        {/* Partner Tabs */}
        {isPartner && (
          <div className="mt-7 rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-sm">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setTab('customer')}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  tab === 'customer'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
                }`}
              >
                My requests
              </button>

              <button
                type="button"
                onClick={() => setTab('partner')}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  tab === 'partner'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
                }`}
              >
                Requests received
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mt-7">
          {/* Loading */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-neutral-200" />

                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-40 rounded bg-neutral-200" />
                      <div className="h-3 w-28 rounded bg-neutral-100" />
                    </div>

                    <div className="h-6 w-20 rounded-full bg-neutral-100" />
                  </div>

                  <div className="mt-5 h-10 rounded-xl bg-neutral-100" />

                  <div className="mt-4 h-4 w-3/4 rounded bg-neutral-100" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <svg
                  className="h-5 w-5 text-red-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path
                    d="M12 8v4M12 16h.01"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h2 className="mt-4 text-sm font-semibold text-neutral-900">
                Couldn't load bookings
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Something went wrong while loading your bookings. Try again.
              </p>
            </div>
          )}

          {/* Empty */}
          {data && data.items.length === 0 && !isLoading && !isError && (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
                <svg
                  className="h-6 w-6 text-brand-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect
                    x="3.5"
                    y="5"
                    width="17"
                    height="16"
                    rx="2"
                  />
                  <path
                    d="M7 3v4M17 3v4M3.5 10h17"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h2 className="mt-4 text-base font-semibold text-neutral-900">
                No bookings yet
              </h2>

              <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-neutral-500">
                {tab === 'customer'
                  ? 'You haven’t requested any activities yet. Find a companion and make your first booking.'
                  : 'You don’t have any booking requests from customers yet.'}
              </p>
            </div>
          )}

          {/* Booking List */}
          {data && data.items.length > 0 && !isLoading && (
            <div className="space-y-4">
              {data.items.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}