import type { ReactNode } from 'react';

export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 py-12 text-center">
      <p className="text-sm text-neutral-500">{message}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
