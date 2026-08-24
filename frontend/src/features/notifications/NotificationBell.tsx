import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from './hooks';
import type { AppNotification } from './types';

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function linkFor(notification: AppNotification): string | null {
  const bookingId = notification.data?.bookingId;
  if (!bookingId) return null;
  return notification.type === 'NEW_MESSAGE' ? `/bookings/${bookingId}/chat` : '/bookings';
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data } = useNotifications(1);
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleClick(notification: AppNotification) {
    if (!notification.readAt) markRead(notification.id);
    const link = linkFor(notification);
    if (link) navigate(link);
    setOpen(false);
  }

  const unreadCount = data?.unreadCount ?? 0;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative text-neutral-600 hover:text-neutral-900"
        aria-label="Notifications"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-80 rounded-lg border border-neutral-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2">
            <span className="text-sm font-medium text-neutral-900">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                className="text-xs text-brand-600 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {(!data || data.items.length === 0) && (
              <p className="px-4 py-6 text-center text-sm text-neutral-500">
                No notifications yet.
              </p>
            )}
            {data?.items.map((n) => (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`block w-full border-b border-neutral-50 px-4 py-3 text-left hover:bg-neutral-50 ${
                  !n.readAt ? 'bg-brand-50/40' : ''
                }`}
              >
                <p className="text-sm font-medium text-neutral-900">{n.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-neutral-600">{n.body}</p>
                <p className="mt-1 text-[10px] text-neutral-400">{timeAgo(n.createdAt)}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
