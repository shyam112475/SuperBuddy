import { Link } from 'react-router-dom';
import { StarRating } from '../../components/StarRating';
import type { PublicPartner } from './types';

export function PartnerCard({ partner }: { partner: PublicPartner }) {
  const initials = partner.partner.fullName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link
      to={`/partners/${partner.id}`}
      className="block rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-brand-100 text-brand-700">
          {partner.partner.profileImage ? (
            <img
              src={partner.partner.profileImage}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold">
              {initials}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-medium text-neutral-900">{partner.partner.fullName}</h3>
            <span className="shrink-0 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
              Verified
            </span>
          </div>
          <p className="truncate text-sm text-neutral-600">{partner.headline}</p>
          <p className="mt-0.5 text-xs text-neutral-400">
            {partner.city}
            {partner.area ? `, ${partner.area}` : ''}
          </p>
          {partner.reviewCount > 0 && (
            <div className="mt-1 flex items-center gap-1.5">
              <StarRating value={Math.round(partner.averageRating ?? 0)} size="sm" />
              <span className="text-xs text-neutral-500">
                {partner.averageRating?.toFixed(1)} ({partner.reviewCount})
              </span>
            </div>
          )}
        </div>
      </div>

      {partner.services.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {partner.services.slice(0, 3).map((s) => (
            <span
              key={s.id}
              className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600"
            >
              {s.category.name}
            </span>
          ))}
          {partner.services.length > 3 && (
            <span className="text-xs text-neutral-400">+{partner.services.length - 3} more</span>
          )}
        </div>
      )}
    </Link>
  );
}
