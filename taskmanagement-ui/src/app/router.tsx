import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layout/AuthLayout';
import DashboardLayout from '../layout/DashboardLayout';
import LoginPage from '../pages/auth/LoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// Workspace Pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import UsersPage from '../pages/dashboard/UsersPage';
import ProjectsPage from '../pages/dashboard/ProjectsPage';
import TasksPage from '../pages/dashboard/TasksPage';
import ReportsPage from '../pages/dashboard/ReportsPage';
import ProfilePage from '../pages/dashboard/ProfilePage';
import SettingsPage from '../pages/dashboard/SettingsPage';
import NotificationsPage from '../pages/dashboard/NotificationsPage';
import { ActivityLogsPage } from '../pages/dashboard/ActivityLogsPage';
import RolesPage from '../pages/dashboard/RolesPage';
import PositionsPage from '../pages/dashboard/PositionsPage';

// Guards
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { PublicRoute } from '../routes/PublicRoute';
import { RoleProtectedRoute } from '../routes/RoleProtectedRoute';
import { ROUTES } from '../utils/constants';

/**
 * Global Router definition using React Router's data APIs.
 * Segregates routing trees into Protected vs. Public-Only routes.
 * Utilizes Nested Routes and Role-Based Guards for enterprise access control.
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
        // Accessible by all authenticated roles
        element: <DashboardPage />,
      },
      {
        path: '/dashboard/users',
        element: (
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <UsersPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/dashboard/projects',
        element: (
          <RoleProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
            <ProjectsPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/dashboard/tasks',
        element: (
          <RoleProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'EMPLOYEE']}>
            <TasksPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/dashboard/reports',
        element: (
          <RoleProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
            <ReportsPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/dashboard/profile',
        element: <ProfilePage />,
      },
      {
        path: '/dashboard/settings',
        element: <SettingsPage />,
      },
      {
        path: '/dashboard/notifications',
        element: <NotificationsPage />,
      },
      {
        path: '/dashboard/activity-logs',
        element: (
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <ActivityLogsPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/dashboard/roles',
        element: (
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <RolesPage />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/dashboard/positions',
        element: (
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <PositionsPage />
          </RoleProtectedRoute>
        ),
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
