import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);

  // The server independently re-checks auth on every request (each screen's
  // API calls will 401 if the session is somehow invalid) — this redirect
  // is a UX guard so an unauthenticated user never sees app screens flash
  // by, not the actual security boundary.
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
