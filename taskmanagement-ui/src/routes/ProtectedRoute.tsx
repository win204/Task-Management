import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ROUTES } from '../utils/constants';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

/**
 * Route guard restricting visibility to authenticated sessions.
 * Supports role-based access control (RBAC).
 */
export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isInitializing, user } = useAuthStore();
  const location = useLocation();

  console.log('[ProtectedRoute] Evaluating access to path:', location.pathname, {
    isAuthenticated,
    isInitializing,
    username: user?.username,
    userRoles: user?.roles,
    requiredRoles: allowedRoles
  });

  // Prevent flicker/redirects during initial auth hydration/refresh
  if (isInitializing) {
    console.log('[ProtectedRoute] Session is initializing. Rendering loading spinner.');
    return (
      <div style={spinnerStyle}>
        <div style={spinnerAnimation}></div>
        <p style={{ marginTop: '16px', fontFamily: 'sans-serif', color: '#4b5563' }}>
          Verifying security session...
        </p>
      </div>
    );
  }

  // Redirect unauthenticated sessions to the login view, retaining the referral location
  if (!isAuthenticated) {
    console.warn('[ProtectedRoute] Anonymous user blocked. Redirecting to login page.');
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Authorize user roles if restrictions are active
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = user?.roles.some((role) => allowedRoles.includes(role));
    
    if (!hasRequiredRole) {
      console.warn(`[ProtectedRoute] Unauthorized role. Required: ${allowedRoles}. Found: ${user?.roles}. Redirecting to dashboard.`);
      // If access is unauthorized, redirect to the dashboard (or an access-denied route)
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
  }

  console.log('[ProtectedRoute] Access granted to secure route.');
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

// Add standard keyframes to head for CSS animation if not already existing
if (typeof document !== 'undefined') {
  const styleId = 'protected-route-spinner-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}
