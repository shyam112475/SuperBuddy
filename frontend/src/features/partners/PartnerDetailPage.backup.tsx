import { useEffect, useState } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';

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

  const [searchParams, setSearchParams] = useSearchParams();

  const { data: partner, isLoading, isError } = usePartnerDetail(id);

  const currentUser = useAuthStore((s) => s.user);

  const [requestingOfferingId, setRequestingOfferingId] =
    useState<string | null>(null);

  /*
   * When user comes from:
   *
   * /partners/:id?book=true
   *
   * automatically open the first available activity.
   */
  useEffect(() => {
    if (
      searchParams.get('book') === 'true' &&
      partner &&
      partner.services.length > 0 &&
      !requestingOfferingId
    ) {
      setRequestingOfferingId(partner.services[0].id);

      // Remove ?book=true from URL after opening booking form.
      setSearchParams({}, { replace: true });
    }
  }, [
    searchParams,
    partner,
    requestingOfferingId,
    setSearchParams,
  ]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-neutral-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="animate-pulse">
            <div className="h-4 w-28 rounded bg-neutral-200" />

            <div className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6">
              <div className="flex gap-5">
                <div className="h-24 w-24 rounded-2xl bg-neutral-200" />

                <div className="flex-1">
                  <div className="h-6 w-48 rounded bg-neutral-200" />

                  <div className="mt-3 h-4 w-64 rounded bg-neutral-200" />

                  <div className="mt-3 h-4 w-32 rounded bg-neutral-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !partner) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-neutral-50 px-6">
        <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-2xl">
            ?
          </div>

          <h1 className="mt-4 text-lg font-semibold text-neutral-900">
            Partner not found
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            This companion may no longer be available.
          </p>

          <Link
            to="/partners"
            className="mt-6 inline-flex rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Back to companions
          </Link>
        </div>
      </div>
    );
  }

  const initials = partner.partner.fullName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isOwnProfile = currentUser?.id === partner.partner.id;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">

        {/* Back */}
        <Link
          to="/partners"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
        >
          <span className="text-lg">←</span>
          Find companions
        </Link>

        {/* Profile Header */}
        <section className="mt-5 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-brand-100 via-brand-50 to-orange-50 sm:h-36" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end">

              {/* Avatar */}
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-brand-100 shadow-md sm:h-28 sm:w-28">
                {partner.partner.profileImage ? (
                  <img
                    src={partner.partner.profileImage}
                    alt={partner.partner.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-brand-700">
                    {initials}
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                    {partner.partner.fullName}
                  </h1>

                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    <span>✓</span>
                    Verified
                  </span>
                </div>

                <p className="mt-1 text-base text-neutral-600">
                  {partner.headline}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                  <span className="flex items-center gap-1">
                    <span>📍</span>
                    {partner.city}
                    {partner.area ? `, ${partner.area}` : ''}
                  </span>

                  {partner.reviewCount > 0 && (
                    <span className="flex items-center gap-1.5">
                      <StarRating
                        value={Math.round(partner.averageRating ?? 0)}
                        size="sm"
                      />

                      <strong className="text-neutral-700">
                        {partner.averageRating?.toFixed(1)}
                      </strong>

                      <span>
                        ({partner.reviewCount})
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">

          {/* Left */}
          <div className="space-y-6">

            {/* About */}
            <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                About
              </h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-neutral-600">
                {partner.bio}
              </p>
            </section>

            {/* Activities */}
            <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Activities
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Choose an activity you'd like to do together.
                </p>
              </div>

              {partner.services.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {partner.services.map((service) => (
                    <div
                      key={service.id}
                      className={`rounded-2xl border p-4 transition ${
                        requestingOfferingId === service.id
                          ? 'border-brand-200 bg-brand-50/30 shadow-sm'
                          : 'border-neutral-200 hover:border-brand-200 hover:shadow-sm'
                      }`}
                    >
                      {/* Activity Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-neutral-900">
                            {service.category.name}
                          </h3>

                          {service.description && (
                            <p className="mt-1 text-sm leading-6 text-neutral-500">
                              {service.description}
                            </p>
                          )}
                        </div>

                        {service.pricePerHour && (
                          <div className="shrink-0 text-right">
                            <p className="text-lg font-bold text-neutral-900">
                              ₹{service.pricePerHour}
                            </p>

                            <p className="text-xs text-neutral-400">
                              per hour
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Booking CTA */}
                      {!isOwnProfile && (
                        <>
                          {currentUser ? (
                            requestingOfferingId !== service.id && (
                              <button
                                type="button"
                                onClick={() =>
                                  setRequestingOfferingId(service.id)
                                }
                                className="mt-4 w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.99]"
                              >
                                Book this activity
                              </button>
                            )
                          ) : (
                            <Link
                              to="/login"
                              className="mt-4 block rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-center text-sm font-semibold text-brand-700 transition hover:bg-brand-100"
                            >
                              Sign in to book
                            </Link>
                          )}

                          {/* Booking Form */}
                          {requestingOfferingId === service.id && (
                            <div className="mt-4 rounded-2xl border border-brand-100 bg-brand-50/40 p-4">
                              <CreateBookingForm
                                partnerProfileId={partner.id}
                                offeringId={service.id}
                                offeringLabel={service.category.name}
                                onDone={() =>
                                  setRequestingOfferingId(null)
                                }
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm text-neutral-500">
                  No activities listed yet.
                </p>
              )}
            </section>

            {/* Availability */}
            {partner.availability.length > 0 && (
              <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-semibold text-neutral-900">
                  Typical availability
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Their usual availability. Exact timing can be discussed while
                  booking.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {partner.availability.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3"
                    >
                      <span className="text-sm font-semibold text-neutral-800">
                        {DAY_LABELS[slot.dayOfWeek]}
                      </span>

                      <span className="text-sm text-neutral-500">
                        {slot.startTime} – {slot.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Reviews
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    What people say about{' '}
                    {partner.partner.fullName.split(' ')[0]}.
                  </p>
                </div>

                {partner.reviewCount > 0 && (
                  <div className="hidden text-right sm:block">
                    <div className="flex items-center gap-2">
                      <StarRating
                        value={Math.round(partner.averageRating ?? 0)}
                        size="sm"
                      />

                      <span className="font-semibold text-neutral-900">
                        {partner.averageRating?.toFixed(1)}
                      </span>
                    </div>

                    <p className="mt-0.5 text-xs text-neutral-400">
                      {partner.reviewCount} reviews
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-5">
                <ReviewList partnerId={partner.id} />
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Book a companion
              </p>

              <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                Find someone for your next activity
              </h3>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Choose an activity above and send a booking request.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm text-brand-700">
                    ✓
                  </span>

                  <div>
                    <p className="text-sm font-medium text-neutral-800">
                      Verified companion
                    </p>

                    <p className="text-xs text-neutral-500">
                      Identity verified by SuperBuddy
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm text-brand-700">
                    🛡
                  </span>

                  <div>
                    <p className="text-sm font-medium text-neutral-800">
                      Safety features
                    </p>

                    <p className="text-xs text-neutral-500">
                      Reporting and SOS support available
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar Book Button */}
              {!isOwnProfile && partner.services.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    setRequestingOfferingId(partner.services[0].id)
                  }
                  className="mt-6 w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.99]"
                >
                  Book companion
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}