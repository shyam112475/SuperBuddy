import { Link, useNavigate } from 'react-router-dom';
import { StarRating } from '../../components/StarRating';
import type { PublicPartner } from './types';

export function PartnerCard({ partner }: { partner: PublicPartner }) {
  const navigate = useNavigate();

  const initials = partner.partner.fullName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg">
      {/* Profile Header */}
      <div className="relative h-24 bg-gradient-to-br from-brand-50 via-white to-brand-100">
        <div className="absolute right-4 top-4">
          <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-green-700 shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Verified
          </span>
        </div>
      </div>

      <div className="px-5 pb-5">
        {/* Avatar */}
        <Link
          to={`/partners/${partner.id}`}
          className="-mt-10 relative block w-fit"
        >
          <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-brand-100 shadow-md">
            {partner.partner.profileImage ? (
              <img
                src={partner.partner.profileImage}
                alt={partner.partner.fullName}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-brand-100 text-xl font-bold text-brand-700">
                {initials}
              </div>
            )}
          </div>
        </Link>

        {/* Name + Location */}
        <Link
          to={`/partners/${partner.id}`}
          className="mt-3 block"
        >
          <h3 className="truncate text-base font-semibold text-neutral-900 transition group-hover:text-brand-700">
            {partner.partner.fullName}
          </h3>

          <p className="mt-0.5 line-clamp-1 text-sm text-neutral-600">
            {partner.headline}
          </p>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21s7-5.25 7-11a7 7 0 10-14 0c0 5.75 7 11 7 11z"
              />
              <circle cx="12" cy="10" r="2.2" />
            </svg>

            <span>
              {partner.city}
              {partner.area ? `, ${partner.area}` : ''}
            </span>
          </div>
        </Link>

        {/* Rating */}
        {partner.reviewCount > 0 ? (
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1">
              <svg
                className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.538 1.118l-2.802-2.036c-.783.57-1.838-.196-1.539-1.118l1.071-3.292a1 1 0 00-.364-1.118L2.973 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.076-3.292z" />
              </svg>

              <span className="text-xs font-semibold text-amber-700">
                {partner.averageRating?.toFixed(1)}
              </span>
            </div>

            <StarRating
              value={Math.round(partner.averageRating ?? 0)}
              size="sm"
            />

            <span className="text-xs text-neutral-400">
              {partner.reviewCount} review
              {partner.reviewCount !== 1 ? 's' : ''}
            </span>
          </div>
        ) : (
          <div className="mt-4 text-xs text-neutral-400">
            New companion · No reviews yet
          </div>
        )}

        {/* Services */}
        {partner.services.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
              Offers
            </p>

            <div className="flex flex-wrap gap-1.5">
              {partner.services.slice(0, 3).map((service) => (
                <span
                  key={service.id}
                  className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-600"
                >
                  {service.category.name}
                </span>
              ))}

              {partner.services.length > 3 && (
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500">
                  +{partner.services.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-5 flex items-center gap-2 border-t border-neutral-100 pt-4">
          {/* View Profile */}
          <Link
            to={`/partners/${partner.id}`}
            className="flex flex-1 items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
          >
            View profile
          </Link>

          {/* Book Companion */}
          <button
            type="button"
            onClick={() => navigate(`/partners/${partner.id}?book=true`)}
            disabled={partner.services.length === 0}
            className="flex flex-1 items-center justify-center rounded-xl bg-brand-600 px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            Book companion
          </button>
        </div>
      </div>
    </div>
  );
}