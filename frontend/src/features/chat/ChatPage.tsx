import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useChatRoom } from './hooks';
import { useBookingDetail } from '../bookings/hooks';
import { useAuthStore } from '../../store/authStore';
import { SOSButton } from '../sos/SOSButton';
import { ReportUserButton } from '../safety/ReportUserButton';
import { BlockUserButton } from '../safety/BlockUserButton';

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 ${
        size === 'sm' ? 'h-8 w-8 text-xs' : 'h-11 w-11 text-sm'
      }`}
    >
      {initials || '?'}
    </div>
  );
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 18.5c-1.8 0-3.25-1.45-3.25-3.25V8.75C3.75 6.95 5.2 5.5 7 5.5h10c1.8 0 3.25 1.45 3.25 3.25v6.5c0 1.8-1.45 3.25-3.25 3.25h-5.25L8 21v-2.5H7Z"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 3-7.5 18-3.5-7-7-3.5L21 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14 21 3" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m12 19-7-7 7-7" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

function formatMessageTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function ChatPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const currentUserId = useAuthStore((s) => s.user?.id);

  const {
    messages,
    isLoading,
    otherPartyOnline,
    otherPartyTyping,
    sendMessage,
    notifyTyping,
  } = useChatRoom(bookingId!);

  const { data: booking } = useBookingDetail(bookingId);

  const otherParty = booking
    ? booking.viewerRole === 'PARTNER'
      ? booking.customer
      : booking.partner
    : null;

  const [draft, setDraft] = useState('');
  const [showSafety, setShowSafety] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingStopTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    return () => {
      if (typingStopTimeout.current) {
        clearTimeout(typingStopTimeout.current);
      }
    };
  }, []);

  function handleChange(value: string) {
    setDraft(value);

    notifyTyping(true);

    if (typingStopTimeout.current) {
      clearTimeout(typingStopTimeout.current);
    }

    typingStopTimeout.current = setTimeout(() => {
      notifyTyping(false);
    }, 2000);
  }

  function handleSend() {
    const trimmed = draft.trim();

    if (!trimmed) return;

    sendMessage(trimmed);
    setDraft('');
    notifyTyping(false);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  const displayName = otherParty?.fullName || 'Companion';
  const firstName = displayName.split(' ')[0];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50">
      <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-4xl flex-col px-0 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="flex shrink-0 items-center border-x border-b border-neutral-200 bg-white px-4 py-3 shadow-sm sm:rounded-t-xl sm:px-5">
          <Link
            to="/bookings"
            className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Back to bookings"
          >
            <ArrowLeftIcon />
          </Link>

          {otherParty ? (
            <>
              <div className="relative">
                <Avatar name={displayName} />

                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                    otherPartyOnline ? 'bg-green-500' : 'bg-neutral-300'
                  }`}
                />
              </div>

              <div className="ml-3 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-sm font-semibold text-neutral-900 sm:text-base">
                    {displayName}
                  </h1>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      otherPartyOnline ? 'bg-green-500' : 'bg-neutral-300'
                    }`}
                  />
                  {otherPartyOnline ? 'Online now' : 'Offline'}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                <ChatIcon />
              </div>

              <div>
                <h1 className="text-sm font-semibold text-neutral-900">Conversation</h1>
                <p className="text-xs text-neutral-500">Loading conversation…</p>
              </div>
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => setShowSafety((value) => !value)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
              aria-label="Conversation options"
            >
              <MoreIcon />
            </button>

            {showSafety && (
              <div className="absolute right-0 top-11 z-20 w-52 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl">
                {otherParty && (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                        Safety
                      </p>
                    </div>

                    <div className="rounded-lg px-3 py-2 text-sm text-neutral-700">
                      <ReportUserButton
                        reportedUserId={otherParty.id}
                        bookingId={bookingId}
                      />
                    </div>

                    <div className="rounded-lg px-3 py-2 text-sm text-neutral-700">
                      <BlockUserButton userId={otherParty.id} />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Booking context */}
        {booking && (
          <div className="border-x border-b border-neutral-200 bg-white px-4 py-2.5 sm:px-5">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />

              <span className="truncate">
                {booking.serviceCategoryName}
              </span>

              <span className="text-neutral-300">•</span>

              <span className="truncate">
                Booking conversation
              </span>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="relative flex-1 overflow-hidden border-x border-neutral-200 bg-white">
          <div className="h-full overflow-y-auto px-4 py-5 sm:px-6">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-300 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-300 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-300" />
                </div>

                <p className="mt-3 text-xs text-neutral-400">
                  Loading messages…
                </p>
              </div>
            )}

            {!isLoading && messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <ChatIcon />
                </div>

                <h2 className="mt-4 text-sm font-semibold text-neutral-900">
                  Start the conversation
                </h2>

                <p className="mt-1 max-w-xs text-xs leading-5 text-neutral-500">
                  Say hello to {firstName} and talk about your upcoming activity.
                </p>
              </div>
            )}

            {!isLoading && messages.length > 0 && (
              <div className="space-y-3">
                {messages.map((message, index) => {
                  const isMine = message.sender.id === currentUserId;
                  const previousMessage = messages[index - 1];

                  const previousDate = previousMessage
                    ? new Date(previousMessage.createdAt).toDateString()
                    : null;

                  const currentDate = new Date(message.createdAt).toDateString();

                  const showDateSeparator = previousDate !== currentDate;

                  return (
                    <div key={message.id}>
                      {showDateSeparator && (
                        <div className="my-5 flex items-center gap-3">
                          <div className="h-px flex-1 bg-neutral-100" />
                          <span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-medium text-neutral-400">
                            {new Date(message.createdAt).toLocaleDateString(undefined, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <div className="h-px flex-1 bg-neutral-100" />
                        </div>
                      )}

                      <div
                        className={`flex ${
                          isMine ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`flex max-w-[82%] items-end gap-2 sm:max-w-[70%] ${
                            isMine ? 'flex-row-reverse' : ''
                          }`}
                        >
                          {!isMine && (
                            <Avatar name={displayName} size="sm" />
                          )}

                          <div
                            className={`rounded-2xl px-3.5 py-2.5 shadow-sm ${
                              isMine
                                ? 'rounded-br-md bg-brand-600 text-white'
                                : 'rounded-bl-md border border-neutral-100 bg-neutral-100 text-neutral-900'
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words text-sm leading-5">
                              {message.content}
                            </p>

                            <div
                              className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                                isMine
                                  ? 'text-brand-100'
                                  : 'text-neutral-400'
                              }`}
                            >
                              <span>
                                {formatMessageTime(message.createdAt)}
                              </span>

                              {isMine && message.readAt && (
                                <span>• Read</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {otherPartyTyping && (
                  <div className="flex items-end gap-2">
                    <Avatar name={displayName} size="sm" />

                    <div className="rounded-2xl rounded-bl-md bg-neutral-100 px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="shrink-0 border-x border-t border-neutral-200 bg-white px-3 py-3 sm:px-5">
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={draft}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`Message ${firstName}…`}
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-50"
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!draft.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-sm transition hover:bg-brand-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </div>

          <p className="mt-2 hidden text-center text-[10px] text-neutral-400 sm:block">
            Keep conversations respectful and related to your booked activity.
          </p>
        </div>

        {/* Safety bar */}
        {otherParty && (
          <div className="flex shrink-0 items-center justify-between gap-3 border-x border-t border-neutral-200 bg-neutral-50 px-4 py-2.5 sm:rounded-b-xl sm:px-5">
            <SOSButton bookingId={bookingId} />

            <div className="flex items-center gap-3 text-xs">
              <ReportUserButton
                reportedUserId={otherParty.id}
                bookingId={bookingId}
              />

              <BlockUserButton userId={otherParty.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}