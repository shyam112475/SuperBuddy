import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAcceptBooking, useCancelBooking, useCompleteBooking, useRejectBooking } from './hooks';
import { PayForBookingButton } from '../payments/PayForBookingButton';
import { SOSButton } from '../sos/SOSButton';
import { ReportUserButton } from '../safety/ReportUserButton';
import { BlockUserButton } from '../safety/BlockUserButton';
import { WriteReviewForm } from '../reviews/WriteReviewForm';
import type { Booking } from './types';

const STATUS_STYLES: Record<Booking['status'], string> = {
  PENDING: 'bg-amber-50 text-amber-700',
  ACCEPTED: 'bg-blue-50 text-blue-700',
  REJECTED: 'bg-red-50 text-red-700',
  CANCELLED: 'bg-neutral-100 text-neutral-600',
  COMPLETED: 'bg-green-50 text-green-700',
};

function formatRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const dateStr = s.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const timeStr = (d: Date) => d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${dateStr}, ${timeStr(s)}–${timeStr(e)}`;
}

export function BookingCard({ booking }: { booking: Booking }) {
  const [showReasonFor, setShowReasonFor] = useState<'reject' | 'cancel' | null>(null);
  const [reason, setReason] = useState('');

  const { mutate: accept, isPending: isAccepting } = useAcceptBooking();
  const { mutate: reject, isPending: isRejecting } = useRejectBooking();
  const { mutate: cancel, isPending: isCancelling } = useCancelBooking();
  const { mutate: complete, isPending: isCompleting } = useCompleteBooking();

  const isPartnerView = booking.viewerRole === 'PARTNER';
  const otherParty = isPartnerView ? booking.customer : booking.partner;

  const canAccept = isPartnerView && booking.status === 'PENDING';
  const canReject = isPartnerView && booking.status === 'PENDING';
  const canComplete = isPartnerView && booking.status === 'ACCEPTED';
  // PENDING can only be cancelled by the customer who requested it; once
  // ACCEPTED, either party can cancel — matches the backend transition table.
  const canCancel =
    (booking.status === 'PENDING' && !isPartnerView) || booking.status === 'ACCEPTED';

  function submitReason(action: 'reject' | 'cancel') {
    if (action === 'reject') reject({ id: booking.id, reason: reason || undefined });
    else cancel({ id: booking.id, reason: reason || undefined });
    setShowReasonFor(null);
    setReason('');
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-neutral-900">{otherParty.fullName}</span>
            <span className="text-xs text-neutral-400">
              {isPartnerView ? '(customer)' : '(companion)'}
            </span>
          </div>
          <p className="text-sm text-neutral-600">{booking.serviceCategoryName}</p>
          <p className="mt-0.5 text-xs text-neutral-500">
            {formatRange(booking.scheduledStart, booking.scheduledEnd)}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[booking.status]}`}>
          {booking.status}
        </span>
      </div>

      <p className="mt-3 text-sm text-neutral-700">{booking.activityDescription}</p>

      {(booking.status === 'ACCEPTED' || booking.status === 'COMPLETED') && (
        <Link
          to={`/bookings/${booking.id}/chat`}
          className="mt-2 inline-block text-xs font-medium text-brand-600 hover:underline"
        >
          Message {otherParty.fullName.split(' ')[0]} →
        </Link>
      )}

      {booking.status === 'REJECTED' && booking.rejectionReason && (
        <p className="mt-2 text-xs text-neutral-500">Reason: {booking.rejectionReason}</p>
      )}
      {booking.status === 'CANCELLED' && booking.cancellationReason && (
        <p className="mt-2 text-xs text-neutral-500">Reason: {booking.cancellationReason}</p>
      )}

      {(canAccept || canReject || canComplete || canCancel) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {canAccept && (
            <button
              onClick={() => accept(booking.id)}
              disabled={isAccepting}
              className="rounded-md bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-60"
            >
              Accept
            </button>
          )}
          {canComplete && (
            <button
              onClick={() => complete(booking.id)}
              disabled={isCompleting}
              className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60"
            >
              Mark completed
            </button>
          )}
          {canReject && (
            <button
              onClick={() => setShowReasonFor('reject')}
              disabled={isRejecting}
              className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
            >
              Decline
            </button>
          )}
          {canCancel && (
            <button
              onClick={() => setShowReasonFor('cancel')}
              disabled={isCancelling}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {showReasonFor && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (optional)"
            className="flex-1 rounded-md border border-neutral-300 px-2 py-1 text-xs"
          />
          <button
            onClick={() => submitReason(showReasonFor)}
            className="rounded-md bg-neutral-800 px-3 py-1 text-xs font-medium text-white"
          >
            Confirm
          </button>
          <button
            onClick={() => setShowReasonFor(null)}
            className="text-xs text-neutral-500 hover:underline"
          >
            Back
          </button>
        </div>
      )}

      {!isPartnerView && booking.status === 'ACCEPTED' && (
        <div className="mt-3 border-t border-neutral-100 pt-3">
          <PayForBookingButton bookingId={booking.id} />
        </div>
      )}

      {!isPartnerView && booking.status === 'COMPLETED' && !booking.hasReview && (
        <div className="mt-3 border-t border-neutral-100 pt-3">
          <WriteReviewForm bookingId={booking.id} partnerName={otherParty.fullName} />
        </div>
      )}

      {(booking.status === 'ACCEPTED' || booking.status === 'COMPLETED') && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-3">
          <SOSButton bookingId={booking.id} />
          <div className="flex items-center gap-3">
            <ReportUserButton reportedUserId={otherParty.id} bookingId={booking.id} />
            <BlockUserButton userId={otherParty.id} />
          </div>
        </div>
      )}
    </div>
  );
}
