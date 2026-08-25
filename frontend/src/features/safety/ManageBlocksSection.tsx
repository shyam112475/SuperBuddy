import { useMyBlocks, useUnblockUser } from './hooks';

export function ManageBlocksSection() {
  const { data: blocks, isLoading } = useMyBlocks();
  const { mutate: unblock, isPending } = useUnblockUser();

  return (
    <section className="border-t border-neutral-200 pt-8">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="12" cy="12" r="9" />
            <path
              strokeLinecap="round"
              d="M5.6 5.6l12.8 12.8"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Blocked users
          </h2>

          <p className="mt-1 text-sm leading-5 text-neutral-500">
            People you've blocked can't message you or make new bookings
            with you.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mt-5">
        {/* Loading */}
        {isLoading && (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`flex items-center justify-between px-4 py-4 ${
                  item !== 3 ? 'border-b border-neutral-100' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 animate-pulse rounded-full bg-neutral-200" />

                  <div>
                    <div className="h-3.5 w-32 animate-pulse rounded bg-neutral-200" />
                    <div className="mt-2 h-3 w-20 animate-pulse rounded bg-neutral-100" />
                  </div>
                </div>

                <div className="h-8 w-20 animate-pulse rounded-lg bg-neutral-100" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && blocks && blocks.length === 0 && (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-neutral-400 shadow-sm">
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
                  d="M5 12l4 4L19 6"
                />
              </svg>
            </div>

            <p className="mt-3 text-sm font-medium text-neutral-700">
              No blocked users
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              You're not currently blocking anyone.
            </p>
          </div>
        )}

        {/* Blocked Users */}
        {!isLoading && blocks && blocks.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            {blocks.map((block, index) => {
              const initials = block.blockedUser.fullName
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={block.id}
                  className={`flex items-center justify-between px-4 py-4 transition hover:bg-neutral-50 ${
                    index !== blocks.length - 1
                      ? 'border-b border-neutral-100'
                      : ''
                  }`}
                >
                  {/* User */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-600">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-neutral-900">
                        {block.blockedUser.fullName}
                      </p>

                      <p className="mt-0.5 text-xs text-neutral-400">
                        Blocked user
                      </p>
                    </div>
                  </div>

                  {/* Unblock */}
                  <button
                    type="button"
                    onClick={() => unblock(block.blockedUser.id)}
                    disabled={isPending}
                    className="shrink-0 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPending ? 'Updating…' : 'Unblock'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}