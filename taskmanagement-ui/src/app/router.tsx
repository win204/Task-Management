import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layout/AuthLayout';
import DashboardLayout from '../layout/DashboardLayout';
import LoginPage from '../pages/auth/LoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { PublicRoute } from '../routes/PublicRoute';
import { ROUTES } from '../utils/constants';

/**
 * Global Router definition using React Router's data APIs.
 * Segregates routing trees into Protected vs. Public-Only routes.
 */
export const router = createBrowserRouter([
  // Redirect root path to dashboard
  {
    path: ROUTES.ROOT,
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },

  // Public Routes (Auth pages) - Only accessible when NOT authenticated
  {
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        element: <ForgotPasswordPage />,
      },
      {
        path: ROUTES.RESET_PASSWORD,
        element: <ResetPasswordPage />,
      },
    ],
  },

  // Protected Routes (App Workspace) - Only accessible when authenticated
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
      // Redirect workspace parent to overview
      {
        path: '/dashboard/*',
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
    ],
  },

  // Wildcard fallback redirecting to root
  {
    path: '*',
    element: <Navigate to={ROUTES.ROOT} replace />,
  },
]);
