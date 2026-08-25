import { useState } from 'react';
import { useCreateReport } from './hooks';
import type { ReportReason } from './types';

const REASON_LABELS: Record<ReportReason, string> = {
  HARASSMENT: 'Harassment',
  INAPPROPRIATE_CONTENT: 'Inappropriate content',
  SAFETY_CONCERN: 'Safety concern',
  FRAUD: 'Fraud',
  SPAM: 'Spam',
  SEXUAL_SOLICITATION:
    'Sexual solicitation (not permitted on SuperBuddy)',
  OTHER: 'Other',
};

export function ReportUserButton({
  reportedUserId,
  bookingId,
}: {
  reportedUserId: string;
  bookingId?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [reason, setReason] =
    useState<ReportReason>('SAFETY_CONCERN');
  const [description, setDescription] = useState('');

  const {
    mutate,
    isPending,
    isSuccess,
    error,
  } = useCreateReport();

  if (isSuccess) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700">
          ✓
        </span>

        <p className="text-xs font-medium text-green-700">
          Report submitted. Thank you for flagging this.
        </p>
      </div>
    );
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-neutral-500 transition hover:bg-red-50 hover:text-red-600"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3l9 18H3L12 3z"
          />

          <path
            strokeLinecap="round"
            d="M12 9v4"
          />

          <path
            strokeLinecap="round"
            d="M12 16.5h.01"
          />
        </svg>

        Report this person
      </button>
    );
  }

  return (
    <div className="w-full max-w-xl rounded-xl border border-red-200 bg-red-50 p-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4"
            />

            <path
              strokeLinecap="round"
              d="M12 16.5h.01"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3l9 18H3L12 3z"
            />
          </svg>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-red-800">
            Report this person
          </h3>

          <p className="mt-1 text-xs leading-5 text-red-700">
            Tell us what happened. Our team will review the report and
            take appropriate action.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="mt-4 rounded-lg border border-red-100 bg-white p-4">
        {/* Reason */}
        <div>
          <label
            htmlFor="report-reason"
            className="block text-xs font-semibold text-neutral-700"
          >
            Reason
          </label>

          <select
            id="report-reason"
            value={reason}
            onChange={(e) =>
              setReason(e.target.value as ReportReason)
            }
            disabled={isPending}
            className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-neutral-50"
          >
            {Object.entries(REASON_LABELS).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            )}
          </select>
        </div>

        {/* Description */}
        <div className="mt-4">
          <label
            htmlFor="report-description"
            className="block text-xs font-semibold text-neutral-700"
          >
            What happened?
          </label>

          <textarea
            id="report-description"
            rows={5}
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            disabled={isPending}
            placeholder="Please provide enough detail for our team to understand what happened."
            className="mt-1.5 w-full resize-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm leading-6 text-neutral-800 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-neutral-50"
          />

          <div className="mt-1 flex items-center justify-between">
            <p className="text-[11px] text-neutral-400">
              Minimum 10 characters required.
            </p>

            <p
              className={`text-[11px] ${
                description.trim().length >= 10
                  ? 'text-green-600'
                  : 'text-neutral-400'
              }`}
            >
              {description.trim().length} characters
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
            <p className="text-xs font-medium text-red-700">
              Something went wrong. Please try again.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              mutate({
                reportedUserId,
                bookingId,
                reason,
                description: description.trim(),
              })
            }
            disabled={
              isPending ||
              description.trim().length < 10
            }
            className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending
              ? 'Submitting…'
              : 'Submit report'}
          </button>

          <button
            type="button"
            onClick={() => {
              setExpanded(false);
              setDescription('');
              setReason('SAFETY_CONCERN');
            }}
            disabled={isPending}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}