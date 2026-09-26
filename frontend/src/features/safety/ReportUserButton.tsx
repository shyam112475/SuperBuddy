import { useState } from 'react';
import { useCreateReport } from './hooks';
import type { ReportReason } from './types';

const REASON_LABELS: Record<ReportReason, string> = {
  HARASSMENT: 'Harassment',
  INAPPROPRIATE_CONTENT: 'Inappropriate content',
  SAFETY_CONCERN: 'Safety concern',
  FRAUD: 'Fraud',
  SPAM: 'Spam',
  SEXUAL_SOLICITATION: 'Sexual solicitation (not permitted on CompanionHub)',
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
  const [reason, setReason] = useState<ReportReason>('SAFETY_CONCERN');
  const [description, setDescription] = useState('');
  const { mutate, isPending, isSuccess, error } = useCreateReport();

  if (isSuccess) {
    return <p className="text-xs text-green-600">Report submitted. Thank you for flagging this.</p>;
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="text-xs text-neutral-500 hover:text-red-600 hover:underline"
      >
        Report this person
      </button>
    );
  }

  return (
    <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 text-xs">
      <label className="block font-medium text-neutral-700">Reason</label>
      <select
        value={reason}
        onChange={(e) => setReason(e.target.value as ReportReason)}
        className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs"
      >
        {Object.entries(REASON_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <label className="mt-2 block font-medium text-neutral-700">What happened?</label>
      <textarea
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Please give enough detail for our team to look into this."
        className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs"
      />

      {error && <p className="mt-1 text-red-600">Something went wrong. Please try again.</p>}

      <div className="mt-2 flex gap-2">
        <button
          onClick={() =>
            mutate({ reportedUserId, bookingId, reason, description })
          }
          disabled={isPending || description.trim().length < 10}
          className="rounded-md bg-neutral-800 px-3 py-1.5 font-medium text-white disabled:opacity-50"
        >
          {isPending ? 'Submitting…' : 'Submit report'}
        </button>
        <button onClick={() => setExpanded(false)} disabled={isPending} className="text-neutral-500 hover:underline">
          Cancel
        </button>
      </div>
    </div>
  );
}
