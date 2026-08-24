import { useState } from 'react';
import { useAdminPartners, useVerifyPartner } from './hooks';

export function AdminPartnersPage() {
  const [page, setPage] = useState(1);
  const [verificationStatus, setVerificationStatus] = useState('');
  const { data, isLoading } = useAdminPartners({
    page,
    verificationStatus: verificationStatus || undefined,
  });
  const { mutate: verify, isPending } = useVerifyPartner();

  return (
    <div>
      <select
        value={verificationStatus}
        onChange={(e) => {
          setVerificationStatus(e.target.value);
          setPage(1);
        }}
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
      >
        <option value="">All statuses</option>
        <option value="UNVERIFIED">Unverified</option>
        <option value="PENDING">Pending</option>
        <option value="VERIFIED">Verified</option>
        <option value="REJECTED">Rejected</option>
      </select>

      <div className="mt-4 space-y-3">
        {isLoading && <p className="text-sm text-neutral-500">Loading…</p>}
        {data?.items.map((partner) => (
          <div key={partner.id} className="rounded-lg border border-neutral-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-neutral-900">{partner.partner.fullName}</p>
                <p className="text-sm text-neutral-600">{partner.headline}</p>
                <p className="text-xs text-neutral-400">
                  {partner.partner.email}
                  {partner.partner.phoneNumber ? ` · ${partner.partner.phoneNumber}` : ''}
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  {partner.city} · {partner.reviewCount} review
                  {partner.reviewCount === 1 ? '' : 's'}
                  {partner.averageRating ? ` (${partner.averageRating.toFixed(1)}★)` : ''}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  partner.partner.verificationStatus === 'VERIFIED'
                    ? 'bg-green-50 text-green-700'
                    : partner.partner.verificationStatus === 'REJECTED'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-amber-50 text-amber-700'
                }`}
              >
                {partner.partner.verificationStatus}
              </span>
            </div>

            {partner.partner.verificationStatus !== 'VERIFIED' && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => verify({ partnerId: partner.id, status: 'VERIFIED' })}
                  disabled={isPending}
                  className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60"
                >
                  Verify
                </button>
                <button
                  onClick={() => verify({ partnerId: partner.id, status: 'REJECTED' })}
                  disabled={isPending}
                  className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                >
                  Reject
                </button>
              </div>
            )}
            {partner.partner.verificationStatus === 'VERIFIED' && (
              <button
                onClick={() => verify({ partnerId: partner.id, status: 'REJECTED' })}
                disabled={isPending}
                className="mt-3 text-xs text-red-600 hover:underline disabled:opacity-60"
              >
                Revoke verification
              </button>
            )}
          </div>
        ))}
      </div>

      {data && data.pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border border-neutral-300 px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-neutral-500">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
          <button
            disabled={page >= data.pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-neutral-300 px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
