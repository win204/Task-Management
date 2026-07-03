import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { router } from './router';
import Providers from './providers';
import { Loader2 } from 'lucide-react';

/**
 * Root Application Entrypoint.
 * Hydrates authentication session on startup and binds routing context.
 */
export default function App() {
  const { initialize, isInitializing } = useAuthStore();

  useEffect(() => {
    console.log('[App Root] Component mounted. Running initialize()...');
    initialize();
  }, [initialize]);

  console.log('[App Root] Rendering. State checks:', { isInitializing });

  // Show a fullscreen loader during startup to avoid flickering or redirect loops
  if (isInitializing) {
    console.log('[App Root] Blocking Router rendering: Session is hydrating...');
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="mt-4 text-sm font-semibold tracking-wide text-slate-500 animate-pulse">
          Starting Workspace Environment...
        </p>
      </div>
    );
  }

  console.log('[App Root] Releasing Router: Rendering RouterProvider.');
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
