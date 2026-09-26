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
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">My Bookings</h1>

      {isPartner && (
        <div className="mt-4 flex gap-1 rounded-md bg-neutral-100 p-1 text-sm">
          <button
            onClick={() => setTab('customer')}
            className={`flex-1 rounded px-3 py-1.5 font-medium ${
              tab === 'customer' ? 'bg-white shadow-sm' : 'text-neutral-500'
            }`}
          >
            As a customer
          </button>
          <button
            onClick={() => setTab('partner')}
            className={`flex-1 rounded px-3 py-1.5 font-medium ${
              tab === 'partner' ? 'bg-white shadow-sm' : 'text-neutral-500'
            }`}
          >
            Requests I've received
          </button>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {isLoading && <p className="text-sm text-neutral-500">Loading…</p>}
        {isError && <p className="text-sm text-red-600">Couldn't load bookings. Try again.</p>}
        {data && data.items.length === 0 && (
          <p className="text-sm text-neutral-500">No bookings here yet.</p>
        )}
        {data?.items.map((booking) => <BookingCard key={booking.id} booking={booking} />)}
      </div>
    </div>
  );
}
