import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useChatRoom } from './hooks';
import { useBookingDetail } from '../bookings/hooks';
import { useAuthStore } from '../../store/authStore';
import { SOSButton } from '../sos/SOSButton';
import { ReportUserButton } from '../safety/ReportUserButton';
import { BlockUserButton } from '../safety/BlockUserButton';

export function ChatPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const { messages, isLoading, otherPartyOnline, otherPartyTyping, sendMessage, notifyTyping } =
    useChatRoom(bookingId!);
  const { data: booking } = useBookingDetail(bookingId);

  const otherParty = booking
    ? booking.viewerRole === 'PARTNER'
      ? booking.customer
      : booking.partner
    : null;

  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingStopTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  function handleChange(value: string) {
    setDraft(value);
    notifyTyping(true);
    if (typingStopTimeout.current) clearTimeout(typingStopTimeout.current);
    typingStopTimeout.current = setTimeout(() => notifyTyping(false), 2000);
  }

  function handleSend() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setDraft('');
    notifyTyping(false);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-2xl flex-col px-6 py-6">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <Link to="/bookings" className="text-sm text-brand-600 hover:underline">
          ← Back to bookings
        </Link>
        <span className="flex items-center gap-1.5 text-xs text-neutral-500">
          <span
            className={`h-2 w-2 rounded-full ${otherPartyOnline ? 'bg-green-500' : 'bg-neutral-300'}`}
          />
          {otherPartyOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto py-4">
        {isLoading && <p className="text-center text-sm text-neutral-500">Loading messages…</p>}
        {!isLoading && messages.length === 0 && (
          <p className="text-center text-sm text-neutral-500">
            No messages yet — say hello about your upcoming activity.
          </p>
        )}

        {messages.map((message) => {
          const isMine = message.sender.id === currentUserId;
          return (
            <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                  isMine ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-900'
                }`}
              >
                {message.content}
                <div
                  className={`mt-1 text-[10px] ${isMine ? 'text-brand-100' : 'text-neutral-400'}`}
                >
                  {new Date(message.createdAt).toLocaleTimeString(undefined, {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                  {isMine && message.readAt && ' · Read'}
                </div>
              </div>
            </div>
          );
        })}

        {otherPartyTyping && <p className="text-xs italic text-neutral-400">typing…</p>}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-neutral-200 pt-3">
        <input
          type="text"
          value={draft}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message…"
          className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <button
          onClick={handleSend}
          disabled={!draft.trim()}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>

      {otherParty && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-3">
          <SOSButton bookingId={bookingId} />
          <div className="flex items-center gap-3">
            <ReportUserButton reportedUserId={otherParty.id} bookingId={bookingId} />
            <BlockUserButton userId={otherParty.id} />
          </div>
        </div>
      )}
    </div>
  );
}
