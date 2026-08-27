import { Link } from 'react-router-dom';
import { Card,  CardBody } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { StarRating } from '../../components/StarRating';
import type { Booking } from './types';

/**
 * ============================================================================
 * PREMIUM BOOKING CARD - Dashboard/List display
 * ============================================================================
 * 
 * Shows booking details with status, actions, and quick info
 */
export function BookingCard({ booking }: { booking: Booking }) {
  const statusColor = {
    PENDING: 'brand',
    CONFIRMED: 'emerald',
    COMPLETED: 'neutral',
    CANCELLED: 'red',
    REJECTED: 'red',
    ACCEPTED: 'green',
  }[booking.status] || 'neutral';

  const statusLabel = {
    PENDING: '⏳ Pending Response',
    ACCEPTED: '✓ Confirmed',
    COMPLETED: '✓ Completed',
    REJECTED: '✕ Cancelled',
    CANCELLED: '✕ Cancelled',
  }[booking.status];

  const isUpcoming = new Date(booking.scheduledStart) > new Date();
  const isPast = new Date(booking.scheduledEnd) < new Date();

  return (
    <Card interactive className="overflow-hidden">
      <Link
        to={`/bookings/${booking.id}/chat`}
        className="block h-full"
      >
        {/* Header with companion info */}
        <CardBody className="space-y-4 pb-0">
          {/* Status badge */}
          <Badge
            variant={statusColor as any}
            size="sm"
          >
            {statusLabel}
          </Badge>

          {/* Companion info */}
          <div className="flex items-center gap-3">
            <Avatar
              name={booking.partner.fullName}
              src={booking.partner.profileImage || undefined}
              size="md"
              verified={booking.status === 'COMPLETED'}
            />

            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-neutral-900 truncate">
                {booking.partner.fullName}
              </h3>

              <p className="text-sm text-neutral-600 truncate">
                {booking.pricePerHourQuoted}
              </p>
            </div>
          </div>

          {/* Booking details */}
          <div className="space-y-2 border-t border-neutral-200 pt-4">
            {/* Service & Price */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">
                {booking.serviceCategoryName}
              </span>
              <span className="font-bold text-brand-600">
                ₹{booking.pricePerHourQuoted}/hr
              </span>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <span>📅</span>
              <span>
                {new Date(booking.scheduledStart).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <span className="text-neutral-400">•</span>
              <span>
                {new Date(booking.scheduledStart).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <span>⏱️</span>
              <span>
                {Math.round(
                  (new Date(booking.scheduledEnd).getTime() -
                    new Date(booking.scheduledStart).getTime()) /
                    (1000 * 60 * 60)
                )}{' '}
                hours
              </span>
            </div>
          </div>

          {/* Rating (if completed) */}
          {isPast && booking.hasReview && (
            <div className="border-t border-neutral-200 pt-4">
              <div className="flex items-center gap-2">
                <StarRating value={booking.hasReview} size="sm" />
                <span className="text-sm font-medium text-neutral-900">
                  {booking.hasReview} stars
                </span>
              </div>
            </div>
          )}
        </CardBody>

        {/* Actions Footer */}
        <div className="border-t border-neutral-200 p-4 bg-neutral-50 mt-4 space-y-2">
          {booking.status === 'PENDING' && (
            <p className="text-xs text-neutral-500 text-center">
              💬 Tap to send a message
            </p>
          )}

          {booking.status === 'ACCEPTED' && isUpcoming && (
            <div className="space-y-2">
              <p className="text-xs text-emerald-600 font-medium text-center">
                ✓ Confirmed & Upcoming
              </p>
              <Button variant="outline" fullWidth size="sm">
                View Details
              </Button>
            </div>
          )}

          {isPast && booking.status === 'COMPLETED' && !booking.hasReview && (
            <Button variant="primary" fullWidth size="sm">
              Leave Review
            </Button>
          )}

          {isPast && booking.hasReview && (
            <p className="text-xs text-neutral-500 text-center">
              ✓ You reviewed this booking
            </p>
          )}
        </div>
      </Link>
    </Card>
  );
}
