import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePartnerDetail } from './hooks';
import { useAuthStore } from '../../store/authStore';
import { CreateBookingForm } from '../bookings/CreateBookingForm';
import { StarRating } from '../../components/StarRating';
import { ReviewList } from '../reviews/ReviewList';

const DAY_LABELS: Record<string, string> = {
  SUNDAY: 'Sun',
  MONDAY: 'Mon',
  TUESDAY: 'Tue',
  WEDNESDAY: 'Wed',
  THURSDAY: 'Thu',
  FRIDAY: 'Fri',
  SATURDAY: 'Sat',
};

export function PartnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: partner, isLoading, isError } = usePartnerDetail(id);
  const currentUser = useAuthStore((s) => s.user);
  const [requestingOfferingId, setRequestingOfferingId] = useState<string | null>(null);

  if (isLoading) {
    return <div className="mx-auto max-w-3xl px-6 py-16 text-sm text-neutral-500">Loading…</div>;
  }

  if (isError || !partner) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-sm text-neutral-600">This partner couldn't be found.</p>
        <Link to="/partners" className="mt-3 inline-block text-sm text-brand-600 hover:underline">
          Back to search
        </Link>
      </div>
    );
  }

  const initials = partner.partner.fullName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-brand-100 text-brand-700">
          {partner.partner.profileImage ? (
            <img
              src={partner.partner.profileImage}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xl font-semibold">
              {initials}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-neutral-900">{partner.partner.fullName}</h1>
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
              Verified
            </span>
          </div>
          <p className="text-neutral-600">{partner.headline}</p>
          <p className="mt-1 text-sm text-neutral-400">
            {partner.city}
            {partner.area ? `, ${partner.area}` : ''}
          </p>
          {partner.reviewCount > 0 && (
            <div className="mt-1.5 flex items-center gap-2">
              <StarRating value={Math.round(partner.averageRating ?? 0)} size="sm" />
              <span className="text-sm text-neutral-500">
                {partner.averageRating?.toFixed(1)} ({partner.reviewCount} review
                {partner.reviewCount === 1 ? '' : 's'})
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">About</h2>
        <p className="mt-2 whitespace-pre-line text-neutral-700">{partner.bio}</p>
      </div>

      {partner.services.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Activities offered
          </h2>
          <div className="mt-3 space-y-3">
            {partner.services.map((s) => (
              <div key={s.id} className="rounded-md border border-neutral-200 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-900">{s.category.name}</span>
                  {s.pricePerHour && (
                    <span className="text-sm text-neutral-600">₹{s.pricePerHour}/hr</span>
                  )}
                </div>
                {s.description && (
                  <p className="mt-1 text-sm text-neutral-600">{s.description}</p>
                )}

                {currentUser && currentUser.id !== partner.partner.id && requestingOfferingId !== s.id && (
                  <button
                    onClick={() => setRequestingOfferingId(s.id)}
                    className="mt-2 rounded-md bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
                  >
                    Request this activity
                  </button>
                )}
                {!currentUser && (
                  <Link
                    to="/login"
                    className="mt-2 inline-block text-xs text-brand-600 hover:underline"
                  >
                    Sign in to request this activity
                  </Link>
                )}

                {requestingOfferingId === s.id && (
                  <div className="mt-3">
                    <CreateBookingForm
                      partnerProfileId={partner.id}
                      offeringId={s.id}
                      offeringLabel={s.category.name}
                      onDone={() => setRequestingOfferingId(null)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {partner.availability.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Typical availability
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {partner.availability.map((slot, i) => (
              <span
                key={i}
                className="rounded-md bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700"
              >
                {DAY_LABELS[slot.dayOfWeek]} {slot.startTime}–{slot.endTime}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Reviews
        </h2>
        <div className="mt-3">
          <ReviewList partnerId={partner.id} />
        </div>
      </div>
    </div>
  );
}
