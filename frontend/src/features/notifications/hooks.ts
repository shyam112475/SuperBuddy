import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../../hooks/useSocket';
import { notificationsApi } from './notificationsApi';
import type { AppNotification, NotificationListResult } from './types';

export function useNotifications(page = 1) {
  const socket = useSocket();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications', page],
    queryFn: () => notificationsApi.list(page),
  });

  // New notifications arrive live while connected — pushed onto the first
  // page's cache directly so the bell/dropdown update without a refetch.
  useEffect(() => {
    if (!socket) return;

    function onNew(notification: AppNotification) {
      queryClient.setQueryData<NotificationListResult>(['notifications', 1], (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: [notification, ...prev.items],
          unreadCount: prev.unreadCount + 1,
        };
      });
    }

    socket.on('notification:new', onNew);
    return () => {
      socket.off('notification:new', onNew);
    };
  }, [socket, queryClient]);

  return query;
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}
