import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { tokenStore } from '../services/tokenStore';

const SOCKET_URL = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');

let sharedSocket: Socket | null = null;

/**
 * Returns a single shared socket connection for the whole app, connecting
 * only once a user session exists and disconnecting when it ends. Multiple
 * components calling this hook all share the same underlying connection
 * rather than opening one per component.
 */
export function useSocket(): Socket | null {
  const user = useAuthStore((s) => s.user);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) {
      sharedSocket?.disconnect();
      sharedSocket = null;
      socketRef.current = null;
      return;
    }

    const token = tokenStore.get();
    if (!token) return;

    if (!sharedSocket || sharedSocket.disconnected) {
      sharedSocket = io(SOCKET_URL, {
        auth: { token },
        withCredentials: true,
      });
    }
    socketRef.current = sharedSocket;

    return () => {
      // Intentionally not disconnecting here — other components using
      // useSocket() may still need the shared connection. It's torn down
      // above when the user logs out instead.
    };
  }, [user]);

  return socketRef.current;
}
