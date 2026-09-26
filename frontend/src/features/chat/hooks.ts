import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../../hooks/useSocket';
import { useAuthStore } from '../../store/authStore';
import { chatApi } from './chatApi';
import type { ChatMessage } from './types';

export function useChatHistory(bookingId: string) {
  return useQuery({
    queryKey: ['chat', bookingId, 'history'],
    queryFn: () => chatApi.listMessages(bookingId),
  });
}

export function useChatRoom(bookingId: string) {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((s) => s.user?.id);

  const [otherPartyOnline, setOtherPartyOnline] = useState(false);
  const [otherPartyTyping, setOtherPartyTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading } = useChatHistory(bookingId);

  // Live incoming messages get appended to the same cached list the REST
  // history query populated, so the UI never has two disjoint message lists.
  useEffect(() => {
    if (!socket) return;

    function onReceive(message: ChatMessage) {
      if (message.bookingId !== bookingId) return;
      queryClient.setQueryData<Awaited<ReturnType<typeof chatApi.listMessages>>>(
        ['chat', bookingId, 'history'],
        (prev) => {
          if (!prev) return prev;
          if (prev.items.some((m) => m.id === message.id)) return prev; // dedupe
          return { ...prev, items: [...prev.items, message] };
        }
      );
      if (message.sender.id !== currentUserId) {
        chatApi.markRead(bookingId).catch(() => {});
      }
    }

    function onOnline(payload: { userId: string }) {
      if (payload.userId !== currentUserId) setOtherPartyOnline(true);
    }
    function onOffline(payload: { userId: string }) {
      if (payload.userId !== currentUserId) setOtherPartyOnline(false);
    }
    function onTypingStart(payload: { bookingId: string; userId: string }) {
      if (payload.bookingId !== bookingId || payload.userId === currentUserId) return;
      setOtherPartyTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setOtherPartyTyping(false), 4000);
    }
    function onTypingStop(payload: { bookingId: string; userId: string }) {
      if (payload.bookingId !== bookingId || payload.userId === currentUserId) return;
      setOtherPartyTyping(false);
    }

    socket.on('message:receive', onReceive);
    socket.on('user:online', onOnline);
    socket.on('user:offline', onOffline);
    socket.on('typing:start', onTypingStart);
    socket.on('typing:stop', onTypingStop);

    return () => {
      socket.off('message:receive', onReceive);
      socket.off('user:online', onOnline);
      socket.off('user:offline', onOffline);
      socket.off('typing:start', onTypingStart);
      socket.off('typing:stop', onTypingStop);
    };
  }, [socket, bookingId, currentUserId, queryClient]);

  // Mark unread messages from the other party as read once history loads.
  useEffect(() => {
    if (data && data.items.some((m) => m.sender.id !== currentUserId && !m.readAt)) {
      chatApi.markRead(bookingId).catch(() => {});
    }
  }, [data, bookingId, currentUserId]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket) return;
      socket.emit('message:send', { bookingId, content });
    },
    [socket, bookingId]
  );

  const notifyTyping = useCallback(
    (isTyping: boolean) => {
      if (!socket) return;
      socket.emit(isTyping ? 'typing:start' : 'typing:stop', { bookingId });
    },
    [socket, bookingId]
  );

  return {
    messages: data?.items ?? [],
    isLoading,
    otherPartyOnline,
    otherPartyTyping,
    sendMessage,
    notifyTyping,
  };
}
