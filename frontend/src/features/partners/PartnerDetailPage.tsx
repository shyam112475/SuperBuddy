import { useEffect, useState } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';

import { usePartnerDetail } from './hooks';
import { useAuthStore } from '../../store/authStore';
import { CreateBookingForm } from '../bookings/CreateBookingForm';
import { StarRating } from '../../components/StarRating';
import { ReviewList } from '../reviews/ReviewList';
import { Card, CardBody, } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';



/**
 * ============================================================================
 * PREMIUM PARTNER DETAIL PAGE - Marketplace Profile
 * ============================================================================
 * 
 * Features:
 * - Full-width hero profile image with overlay
 * - Premium profile header with verification
 * - Enhanced about section (card-based)
 * - Services section (card grid)
 * - Premium reviews with better styling
 * - Trust & safety section
 * - Sticky booking CTA (desktop sidebar + mobile bottom)
 */
export function PartnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [_showMobileBooking, _setShowMobileBooking] = useState(false);

  const { data: partner, isLoading, isError } = usePartnerDetail(id);
  const currentUser = useAuthStore((s) => s.user);

  const [requestingOfferingId, setRequestingOfferingId] =
    useState<string | null>(null);

  const isOwnProfile = currentUser?.id === partner?.id;

  useEffect(() => {
    if (
      searchParams.get('book') === 'true' &&
      partner &&
      partner.services.length > 0 &&
      !requestingOfferingId
    ) {
      setRequestingOfferingId(partner.services[0].id);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, partner, requestingOfferingId, setSearchParams]);

  // ========================================================================
  // LOADING STATE
  // ========================================================================
  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-neutral-0">
        <div className="animate-pulse">
          {/* Hero skeleton */}
          <div className="h-96 sm:h-[500px] bg-neutral-200" />

          {/* Content skeleton */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-6">
              <div className="h-8 w-48 rounded bg-neutral-200" />
              <div className="h-4 w-72 rounded bg-neutral-200" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-4 w-full rounded bg-neutral-200" />
                  <div className="h-4 w-5/6 rounded bg-neutral-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================================
  // ERROR STATE
  // ========================================================================
  if (isError || !partner) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-neutral-0 px-4">
        <Card className="max-w-md">
          <CardBody className="text-center space-y-4 py-12">
            <div className="text-5xl">😕</div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Companion not found
              </h1>
              <p className="mt-2 text-neutral-600">
                This companion may no longer be available.
              </p>
            </div>
            <Link to="/partners">
              <Button variant="primary">
                Browse Other Companions
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  // ========================================================================
  // RENDER: PREMIUM PARTNER DETAIL PAGE
  // ========================================================================
  return (
    <div className="min-h-screen bg-neutral-0">
      {/* ====================================================================
          PREMIUM HERO SECTION - Full-width profile image
          ==================================================================== */}
      <div className="relative w-full overflow-hidden">
        {/* Hero image container */}
        <div className="relative h-80 sm:h-96 lg:h-[500px] bg-neutral-200 overflow-hidden group">
          {partner.partner.profileImage ? (
            <img
              src={partner.partner.profileImage}
              alt={partner.partner.fullName}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-brand flex items-center justify-center text-6xl opacity-10">
              👤
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Top badges - Verification & Status */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
            {partner.isAcceptingBookings && (
              <Badge variant="success" size="sm" icon="✓">
                Verified
              </Badge>
            )}
          </div>

          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <Badge variant="secondary" size="sm">
              Available
            </Badge>
          </div>

          {/* Rating overlay - Bottom left */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
            {partner.reviewCount > 0 ? (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="font-bold text-neutral-900">
                      {partner.averageRating?.toFixed(1)}
                    </p>
                    <p className="text-xs text-neutral-600">
                      {partner.reviewCount} reviews
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
                <p className="text-sm font-semibold text-neutral-900">
                  ✨ New companion
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ====================================================================
          MAIN CONTENT SECTION
          ==================================================================== */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main content column */}
          <div className="lg:col-span-2 space-y-12">
            {/* =========================================================
                PREMIUM PROFILE HEADER
                ========================================================= */}
            <section className="space-y-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900">
                  {partner.partner.fullName}
                </h1>

                {partner.headline && (
                  <p className="text-lg sm:text-xl text-neutral-600 mt-2">
                    {partner.headline}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-4 text-neutral-600">
                  <span className="flex items-center gap-1.5">
                    📍 {partner.city}
                    {partner.area && `, ${partner.area}`}
                  </span>

                  {partner.reviewCount > 0 && (
                    <span className="flex items-center gap-1.5">
                      <StarRating
                        value={Math.round(partner.averageRating ?? 0)}
                        size="sm"
                      />
                      {partner.averageRating?.toFixed(1)} ({partner.reviewCount})
                    </span>
                  )}
                </div>
              </div>

              {/* Services tags */}
              {partner.services.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4">
                  {partner.services.slice(0, 4).map((service) => (
                    <Badge key={service.id} variant="primary">
                      {service.category.name}
                    </Badge>
                  ))}

                  {partner.services.length > 4 && (
                    <Badge variant="neutral">
                      +{partner.services.length - 4} more
                    </Badge>
                  )}
                </div>
              )}
            </section>

            {/* =========================================================
                ABOUT SECTION
                ========================================================= */}
            <section>
              <Card>
                <CardBody className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                      About {partner.partner.fullName.split(' ')[0]}
                    </h2>

                    {partner.bio && (
                      <p className="text-lg text-neutral-700 leading-relaxed whitespace-pre-wrap">
                        {partner.bio}
                      </p>
                    )}
                  </div>

                  {/* Profile stats */}
                  <div className="border-t border-neutral-200 pt-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Member Since
                      </p>
                      <p className="text-base font-semibold text-neutral-900 mt-1">
                        {new Date(partner.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Response Time
                      </p>
                      <p className="text-base font-semibold text-neutral-900 mt-1">
                        Usually &lt;1hr
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </section>

            {/* =========================================================
                SERVICES & PRICING SECTION
                ========================================================= */}
            {partner.services.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Services & Pricing
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {partner.services.map((service) => (
                    <Card key={service.id} className="flex flex-col">
                      <CardBody className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-neutral-900">
                            {service.category.name}
                          </h3>

                          <p className="text-sm text-neutral-600 mt-1">
                            {service.category.name}
                          </p>
                        </div>

                        {service.description && (
                          <p className="text-sm text-neutral-600 line-clamp-2">
                            {service.description}
                          </p>
                        )}

                        <div className="border-t border-neutral-200 pt-4 space-y-2">
                          <div className="flex items-baseline justify-between">
                            <span className="text-sm text-neutral-600">Rate</span>
                            <span className="text-2xl font-bold text-brand-600">
                              ₹{service.pricePerHour}
                            </span>
                          </div>

                          {service.pricePerHour && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-neutral-600">Min. hours</span>
                              <span className="font-medium text-neutral-900">
                                {service.pricePerHour}h
                              </span>
                            </div>
                          )}
                        </div>

                        {!isOwnProfile && (
                          <Button
                            variant="primary"
                            fullWidth
                            onClick={() =>
                              setRequestingOfferingId(service.id)
                            }
                          >
                            Book This Service
                          </Button>
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* =========================================================
                TRUST & SAFETY SECTION
                ========================================================= */}
            <section>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Safety & Trust
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                {/* Verified */}
                <Card className="bg-gradient-subtle border-0">
                  <CardBody className="space-y-3">
                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-white">
                      <span className="text-xl">✓</span>
                    </div>

                    <div>
                      <h3 className="font-bold text-neutral-900">
                        Verified
                      </h3>
                      <p className="text-sm text-neutral-600 mt-1">
                        Identity verified by SuperBuddy
                      </p>
                    </div>
                  </CardBody>
                </Card>

                {/* Safety Tools */}
                <Card className="bg-gradient-subtle border-0">
                  <CardBody className="space-y-3">
                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-white">
                      <span className="text-xl">🛡️</span>
                    </div>

                    <div>
                      <h3 className="font-bold text-neutral-900">
                        Safety Tools
                      </h3>
                      <p className="text-sm text-neutral-600 mt-1">
                        Report & SOS support
                      </p>
                    </div>
                  </CardBody>
                </Card>

                {/* Messaging */}
                <Card className="bg-gradient-subtle border-0">
                  <CardBody className="space-y-3">
                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-white">
                      <span className="text-xl">💬</span>
                    </div>

                    <div>
                      <h3 className="font-bold text-neutral-900">
                        Secure Chat
                      </h3>
                      <p className="text-sm text-neutral-600 mt-1">
                        In-app messaging only
                      </p>
                    </div>
                  </CardBody>
                </Card>

                {/* Reviews */}
                <Card className="bg-gradient-subtle border-0">
                  <CardBody className="space-y-3">
                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-white">
                      <span className="text-xl">⭐</span>
                    </div>

                    <div>
                      <h3 className="font-bold text-neutral-900">
                        Reviews
                      </h3>
                      <p className="text-sm text-neutral-600 mt-1">
                        Real verified reviews
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </section>

            {/* =========================================================
                REVIEWS SECTION
                ========================================================= */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">
                  Reviews & Ratings
                </h2>

                {partner.reviewCount > 0 && (
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <StarRating
                        value={Math.round(partner.averageRating ?? 0)}
                        size="sm"
                      />
                      <span className="font-bold text-neutral-900">
                        {partner.averageRating?.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500">
                      {partner.reviewCount} reviews
                    </p>
                  </div>
                )}
              </div>

              <ReviewList partnerId={partner.id} />
            </section>
          </div>

          {/* ========================================================================
              DESKTOP SIDEBAR - Sticky Booking CTA
              ======================================================================== */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-2xl border border-neutral-200 bg-white p-6 shadow-card space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Ready to connect?
                </p>
                <h3 className="text-xl font-bold text-neutral-900 mt-2">
                  Book {partner.partner.fullName.split(' ')[0]}
                </h3>
                <p className="text-sm text-neutral-600 mt-2">
                  Choose a service above and send a booking request.
                </p>
              </div>

              {!isOwnProfile && partner.services.length > 0 && (
                <>
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    onClick={() =>
                      setRequestingOfferingId(partner.services[0].id)
                    }
                  >
                    Book Now
                  </Button>

                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => {
                      const el = document.getElementById('services');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    View Services
                  </Button>
                </>
              )}

              {/* Trust badges */}
              <div className="border-t border-neutral-200 pt-6 space-y-3">
                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-600">
                    ✓
                  </span>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      Verified companion
                    </p>
                    <p className="text-xs text-neutral-500">
                      Identity verified
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm text-brand-600">
                    🛡️
                  </span>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      Safety first
                    </p>
                    <p className="text-xs text-neutral-500">
                      Protected by SuperBuddy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ========================================================================
          MOBILE STICKY BOOKING CTA
          ======================================================================== */}
      {!isOwnProfile && partner.services.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-neutral-200 shadow-lg p-4 safe-area-inset-bottom">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={() => setRequestingOfferingId(partner.services[0].id)}
          >
            Book {partner.partner.fullName.split(' ')[0]}
          </Button>
        </div>
      )}

      {/* ========================================================================
          BOOKING FORM MODAL
          ======================================================================== */}
      {requestingOfferingId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
          <div className="flex min-h-full items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardBody className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-neutral-900">
                    Book a Service
                  </h2>
                  <button
                    onClick={() => setRequestingOfferingId(null)}
                    className="text-neutral-500 hover:text-neutral-700"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <CreateBookingForm
                  partnerId={partner.id}
                  serviceId={requestingOfferingId}
                  onSuccess={() => setRequestingOfferingId(null)}
                />
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
