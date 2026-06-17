import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ROUTES } from '../utils/constants';

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * Route guard redirecting authenticated users away from public-only auth routes (e.g. Login, Forgot Password).
 */
export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, isInitializing } = useAuthStore();
  const location = useLocation();

  console.log('[PublicRoute] Evaluating access to path:', location.pathname, {
    isAuthenticated,
    isInitializing
  });

  // Prevent flicker/redirects during initial auth hydration/refresh
  if (isInitializing) {
    console.log('[PublicRoute] Session is initializing. Rendering loading spinner.');
    return (
      <div style={spinnerStyle}>
        <div style={spinnerAnimation}></div>
        <p style={{ marginTop: '16px', fontFamily: 'sans-serif', color: '#4b5563' }}>
          Restoring security session...
        </p>
      </div>
    );
  }

  // Redirect authenticated sessions to dashboard or redirect origin
  if (isAuthenticated) {
    const state = location.state as { from?: { pathname: string } } | null;
    const from = state?.from?.pathname || ROUTES.DASHBOARD;
    console.warn(`[PublicRoute] Authenticated user blocked from public path ${location.pathname}. Redirecting to: ${from}`);
    return <Navigate to={from} replace />;
  }

  console.log('[PublicRoute] Access granted to public route.');
  return <>{children}</>;
};

const spinnerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100vw',
  backgroundColor: '#f3f4f6',
};

const spinnerAnimation: React.CSSProperties = {
  width: '40px',
  height: '40px',
  border: '4px solid #e5e7eb',
  borderTop: '4px solid #3b82f6',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};
