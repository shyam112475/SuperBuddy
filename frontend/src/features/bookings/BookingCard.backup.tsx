import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useAcceptBooking,
  useCancelBooking,
  useCompleteBooking,
  useRejectBooking,
} from './hooks';
import { PayForBookingButton } from '../payments/PayForBookingButton';
import { SOSButton } from '../sos/SOSButton';
import { ReportUserButton } from '../safety/ReportUserButton';
import { BlockUserButton } from '../safety/BlockUserButton';
import { WriteReviewForm } from '../reviews/WriteReviewForm';
import type { Booking } from './types';

const STATUS_STYLES: Record<Booking['status'], string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  ACCEPTED: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  REJECTED: 'bg-red-50 text-red-700 ring-red-600/20',
  CANCELLED: 'bg-neutral-100 text-neutral-600 ring-neutral-500/20',
  COMPLETED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
};

function formatRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);

  const dateStr = s.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const timeStr = (d: Date) =>
    d.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });

  return `${dateStr}, ${timeStr(s)}–${timeStr(e)}`;
}

function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path strokeLinecap="round" d="M7 3v4M17 3v4M3.5 10h17" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 11.5a7.5 7.5 0 01-8 7.5 8.5 8.5 0 01-3.5-.75L4 20l1.75-3.75A7.5 7.5 0 1112 4a7.5 7.5 0 018 7.5z"
      />
    </svg>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export function BookingCard({ booking }: { booking: Booking }) {
  const [showReasonFor, setShowReasonFor] = useState<'reject' | 'cancel' | null>(
    null,
  );
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

  // PENDING can only be cancelled by the customer who requested it;
  // once ACCEPTED, either party can cancel.
  const canCancel =
    (booking.status === 'PENDING' && !isPartnerView) ||
    booking.status === 'ACCEPTED';

  function submitReason(action: 'reject' | 'cancel') {
    if (action === 'reject') {
      reject({
        id: booking.id,
        reason: reason || undefined,
      });
    } else {
      cancel({
        id: booking.id,
        reason: reason || undefined,
      });
    }

    setShowReasonFor(null);
    setReason('');
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {/* Avatar */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600">
              {getInitials(otherParty.fullName)}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-semibold text-neutral-900">
                  {otherParty.fullName}
                </span>

                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-500">
                  {isPartnerView ? 'Customer' : 'Companion'}
                </span>
              </div>

              <p className="mt-0.5 text-sm text-neutral-500">
                {booking.serviceCategoryName}
              </p>
            </div>
          </div>

          {/* Status */}
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${
              STATUS_STYLES[booking.status]
            }`}
          >
            {booking.status}
          </span>
        </div>

        {/* Schedule */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2.5 text-sm text-neutral-600">
          <CalendarIcon />

          <span className="font-medium">
            {formatRange(
              booking.scheduledStart,
              booking.scheduledEnd,
            )}
          </span>
        </div>

        {/* Description */}
        <div className="mt-4">
          <p className="text-sm leading-6 text-neutral-700">
            {booking.activityDescription}
          </p>
        </div>

        {/* Chat */}
        {(booking.status === 'ACCEPTED' ||
          booking.status === 'COMPLETED') && (
          <Link
            to={`/bookings/${booking.id}/chat`}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
          >
            <ChatIcon />
            Message {otherParty.fullName.split(' ')[0]}
          </Link>
        )}

        {/* Rejection reason */}
        {booking.status === 'REJECTED' &&
          booking.rejectionReason && (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-3.5 py-3">
              <p className="text-xs font-semibold text-red-800">
                Decline reason
              </p>

              <p className="mt-1 text-sm leading-5 text-red-700">
                {booking.rejectionReason}
              </p>
            </div>
          )}

        {/* Cancellation reason */}
        {booking.status === 'CANCELLED' &&
          booking.cancellationReason && (
            <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-3">
              <p className="text-xs font-semibold text-neutral-700">
                Cancellation reason
              </p>

              <p className="mt-1 text-sm leading-5 text-neutral-600">
                {booking.cancellationReason}
              </p>
            </div>
          )}

        {/* Primary Actions */}
        {(canAccept || canReject || canComplete || canCancel) && (
          <div className="mt-5 flex flex-wrap gap-2">
            {canAccept && (
              <button
                onClick={() => accept(booking.id)}
                disabled={isAccepting}
                className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isAccepting ? 'Accepting...' : 'Accept booking'}
              </button>
            )}

            {canComplete && (
              <button
                onClick={() => complete(booking.id)}
                disabled={isCompleting}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCompleting ? 'Completing...' : 'Mark completed'}
              </button>
            )}

            {canReject && (
              <button
                onClick={() => setShowReasonFor('reject')}
                disabled={isRejecting}
                className="rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-700 transition-all hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Decline
              </button>
            )}

            {canCancel && (
              <button
                onClick={() => setShowReasonFor('cancel')}
                disabled={isCancelling}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 transition-all hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            )}
          </div>
        )}

        {/* Reason Form */}
        {showReasonFor && (
          <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <p className="mb-2 text-xs font-semibold text-neutral-700">
              {showReasonFor === 'reject'
                ? 'Why are you declining?'
                : 'Why are you cancelling?'}
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason (optional)"
                className="min-w-0 flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 outline-none transition-all placeholder:text-neutral-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => submitReason(showReasonFor)}
                  className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-neutral-800"
                >
                  Confirm
                </button>

                <button
                  onClick={() => setShowReasonFor(null)}
                  className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-100"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customer Payment */}
      {!isPartnerView && booking.status === 'ACCEPTED' && (
        <div className="border-t border-neutral-100 bg-neutral-50/50 px-5 py-4">
          <PayForBookingButton bookingId={booking.id} />
        </div>
      )}

      {/* Review */}
      {!isPartnerView &&
        booking.status === 'COMPLETED' &&
        !booking.hasReview && (
          <div className="border-t border-neutral-100 px-5 py-4">
            <p className="mb-3 text-sm font-semibold text-neutral-900">
              How was your experience?
            </p>

            <WriteReviewForm
              bookingId={booking.id}
              partnerName={otherParty.fullName}
            />
          </div>
        )}

      {/* Safety Actions */}
      {(booking.status === 'ACCEPTED' ||
        booking.status === 'COMPLETED') && (
        <div className="flex flex-col gap-3 border-t border-neutral-100 bg-neutral-50/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <SOSButton bookingId={booking.id} />

          <div className="flex items-center gap-4">
            <ReportUserButton
              reportedUserId={otherParty.id}
              bookingId={booking.id}
            />

            <BlockUserButton userId={otherParty.id} />
          </div>
        </div>
      )}
    </div>
  );
}