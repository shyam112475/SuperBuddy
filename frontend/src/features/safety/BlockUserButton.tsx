import { useState } from 'react';
import { useBlockUser } from './hooks';

export function BlockUserButton({ userId }: { userId: string }) {
  const [confirming, setConfirming] = useState(false);
  const { mutate, isPending, isSuccess } = useBlockUser();

  if (isSuccess) {
    return <p className="text-xs text-neutral-500">Blocked. They can no longer message or book you.</p>;
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-xs text-neutral-500 hover:text-red-600 hover:underline"
      >
        Block this person
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-neutral-600">Block this person? They won't be able to message or book you.</span>
      <button
        onClick={() => mutate(userId)}
        disabled={isPending}
        className="rounded-md bg-red-600 px-2.5 py-1 font-medium text-white disabled:opacity-60"
      >
        {isPending ? 'Blocking…' : 'Confirm'}
      </button>
      <button onClick={() => setConfirming(false)} disabled={isPending} className="text-neutral-500 hover:underline">
        Cancel
      </button>
    </div>
  );
}
