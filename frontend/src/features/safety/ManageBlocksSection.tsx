import { useMyBlocks, useUnblockUser } from './hooks';

export function ManageBlocksSection() {
  const { data: blocks, isLoading } = useMyBlocks();
  const { mutate: unblock, isPending } = useUnblockUser();

  return (
    <section className="border-t border-neutral-200 pt-8">
      <h2 className="text-lg font-semibold text-neutral-900">Blocked users</h2>
      <p className="mt-1 text-sm text-neutral-600">
        People you've blocked can't message or book you.
      </p>

      <div className="mt-4 space-y-2">
        {isLoading && <p className="text-sm text-neutral-500">Loading…</p>}
        {blocks && blocks.length === 0 && (
          <p className="text-sm text-neutral-500">You haven't blocked anyone.</p>
        )}
        {blocks?.map((block) => (
          <div
            key={block.id}
            className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2"
          >
            <span className="text-sm text-neutral-900">{block.blockedUser.fullName}</span>
            <button
              onClick={() => unblock(block.blockedUser.id)}
              disabled={isPending}
              className="text-xs text-brand-600 hover:underline disabled:opacity-50"
            >
              Unblock
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
