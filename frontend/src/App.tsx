import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes/AppRoutes';
import { useSessionInit } from './features/auth/useSessionInit';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

function SessionBoundary() {
  // Silently exchanges the httpOnly refresh cookie for a session on load,
  // so a page reload doesn't force a re-login.
  useSessionInit();
  return <AppRoutes />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SessionBoundary />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
