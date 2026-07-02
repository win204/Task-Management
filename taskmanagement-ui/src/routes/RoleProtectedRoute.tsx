import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ROUTES } from '../utils/constants';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

/**
 * Secures a route based on the current user's roles.
 * Must be used inside a <ProtectedRoute> to ensure user is authenticated first.
 */
export const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    // Should not happen if wrapped in ProtectedRoute, but safe fallback
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // If the route has no specific roles required, or user has an allowed role
  const hasAccess = allowedRoles.length === 0 || allowedRoles.some((role) => (user.roles || []).includes(role));

  if (!hasAccess) {
    console.warn(`Access denied. User ${user.username} lacks required roles for ${location.pathname}`);
    // Redirect to a safe fallback, like the dashboard overview
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};
