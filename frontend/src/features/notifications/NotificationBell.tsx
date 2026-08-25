import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from './hooks';
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
  return notification.type === 'NEW_MESSAGE'
    ? `/bookings/${bookingId}/chat`
    : '/bookings';
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
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleClick(notification: AppNotification) {
    if (!notification.readAt) {
      markRead(notification.id);
    }

    const link = linkFor(notification);

    if (link) {
      navigate(link);
    }

    setOpen(false);
  }

  const unreadCount = data?.unreadCount ?? 0;

  return (
    <div className="relative" ref={containerRef}>
      {/* Notification Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
          open
            ? 'bg-brand-50 text-brand-600'
            : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
        }`}
        aria-label="Notifications"
      >
        <svg
          className="h-[21px] w-[21px] transition-transform duration-200 group-hover:scale-105"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[9px] font-bold leading-none text-white shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {open && (
        <div className="absolute right-0 z-50 mt-3 w-[min(390px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.18)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <div>
              <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-900">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <p className="mt-0.5 text-xs text-neutral-500">
                  {unreadCount} unread notification
                  {unreadCount === 1 ? '' : 's'}
                </p>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications */}
          <div className="max-h-[420px] overflow-y-auto">
            {(!data || data.items.length === 0) && (
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.7}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                  </svg>
                </div>

                <p className="mt-4 text-sm font-medium text-neutral-800">
                  No notifications yet
                </p>

                <p className="mt-1 max-w-[230px] text-xs leading-5 text-neutral-500">
                  You're all caught up. New activity will appear here.
                </p>
              </div>
            )}

            {data?.items.map((n) => {
              const isUnread = !n.readAt;

              return (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`group relative flex w-full gap-3 border-b border-neutral-100 px-5 py-4 text-left transition-colors last:border-b-0 ${
                    isUnread
                      ? 'bg-brand-50/50 hover:bg-brand-50'
                      : 'bg-white hover:bg-neutral-50'
                  }`}
                >
                  {/* Unread indicator */}
                  <div className="flex w-2 shrink-0 justify-center pt-1.5">
                    {isUnread && (
                      <span className="h-2 w-2 rounded-full bg-brand-600" />
                    )}
                  </div>

                  {/* Notification Icon */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isUnread
                        ? 'bg-brand-100 text-brand-600'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    <svg
                      className="h-[18px] w-[18px]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.7}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                      />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p
                        className={`line-clamp-1 text-sm leading-5 ${
                          isUnread
                            ? 'font-semibold text-neutral-900'
                            : 'font-medium text-neutral-800'
                        }`}
                      >
                        {n.title}
                      </p>

                      <span className="shrink-0 pt-0.5 text-[10px] font-medium text-neutral-400">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">
                      {n.body}
                    </p>
                  </div>

                  {/* Hover arrow */}
                  <svg
                    className="mt-2 h-3.5 w-3.5 shrink-0 text-neutral-300 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}