import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a global query client instance for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry failed requests once before showing an error
      refetchOnWindowFocus: false, // Prevent refetching when switching browser tabs
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Global provider shell. Encapsulates UI providers (like alerts/notifications)
 * and state providers (like React Query) to keep App.tsx clean and maintainable.
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1e293b',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            fontFamily: 'sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      {children}
    </QueryClientProvider>
  );
}
