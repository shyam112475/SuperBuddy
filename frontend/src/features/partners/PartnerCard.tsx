import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card,  CardBody } from '../../components/Card';
import { StarRating } from '../../components/StarRating';
import type { PublicPartner } from './types';

/**
 * ============================================================================
 * PREMIUM PARTNER CARD - Image-First Marketplace Design
 * ============================================================================
 * 
 * Features:
 * - Large, prominent profile image (image-first design)
 * - Quick info overlay on hover
 * - Verification badge
 * - Rating display
 * - Service tags
 * - Premium hover interactions
 * - Mobile-optimized
 */
export function PartnerCard({ partner }: { partner: PublicPartner }) {
  const navigate = useNavigate();

  const isVerified = true; // Assuming from the original design
  const hasReviews = partner.reviewCount > 0;

  return (
    <Link
      to={`/partners/${partner.id}`}
      className="group"
    >
      <Card
        interactive
        className="overflow-hidden h-full flex flex-col"
      >
        {/* ===== LARGE PROFILE IMAGE (Image-First) ===== */}
        <div className="relative overflow-hidden h-60 sm:h-72 bg-neutral-100">
          {partner.partner.profileImage ? (
            <img
              src={partner.partner.profileImage}
              alt={partner.partner.fullName}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full bg-gradient-brand flex items-center justify-center text-6xl text-white opacity-20">
              👤
            </div>
          )}

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Verification Badge - Top Right */}
          {isVerified && (
            <div className="absolute top-4 right-4">
              <Badge variant="success" size="sm" icon="✓">
                Verified
              </Badge>
            </div>
          )}

          {/* Online Status Indicator - Top Left */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            <span className="text-xs font-semibold text-white drop-shadow">
              Available
            </span>
          </div>
        </div>

        {/* ===== CARD BODY - Premium Content ===== */}
        <CardBody className="flex-1 flex flex-col space-y-4">
          {/* Name & Location */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-neutral-900 truncate group-hover:text-brand-600 transition-colors">
                  {partner.partner.fullName}
                </h3>

                <p className="text-sm text-neutral-600 line-clamp-1">
                  {partner.headline}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-sm text-neutral-500">
              <span>📍</span>
              <span className="truncate">
                {partner.city}
                {partner.area ? `, ${partner.area}` : ''}
              </span>
            </div>
          </div>

          {/* Rating Section */}
          {hasReviews ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-lg">⭐</span>
                <span className="font-bold text-neutral-900">
                  {partner.averageRating?.toFixed(1)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <StarRating
                  value={Math.round(partner.averageRating ?? 0)}
                  size="sm"
                />
              </div>

              <span className="text-xs font-medium text-neutral-500 whitespace-nowrap">
                {partner.reviewCount}
                {partner.reviewCount === 1 ? ' review' : ' reviews'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <span>✨</span>
              <span>New companion · No reviews yet</span>
            </div>
          )}

          {/* Services Tags */}
          {partner.services.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Services
              </p>

              <div className="flex flex-wrap gap-2">
                {partner.services.slice(0, 2).map((service) => (
                  <Badge
                    key={service.id}
                    size="sm"
                    className="text-xs"
                  >
                    {service.category.name}
                  </Badge>
                ))}

                {partner.services.length > 2 && (
                  <Badge size="sm" variant="neutral">
                    +{partner.services.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Spacer to push buttons to bottom */}
          <div className="flex-1" />

          {/* CTA Buttons */}
          <div className="space-y-2 border-t border-neutral-200 pt-4">
            <Button
              variant="primary"
              fullWidth
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/partners/${partner.id}?book=true`);
              }}
            >
              Book Now
            </Button>

            <Button
              variant="outline"
              fullWidth
              size="sm"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              View Profile
            </Button>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
