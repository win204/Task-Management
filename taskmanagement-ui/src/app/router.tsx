import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layout/AuthLayout';
import DashboardLayout from '../layout/DashboardLayout';
import LoginPage from '@/features/auth/pages/LoginPage';
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage';

// Workspace Pages
import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import UsersPage from '@/features/users/pages/UsersPage';
import ProjectsPage from '@/features/projects/pages/ProjectsPage';
import TasksPage from '@/features/tasks/pages/TasksPage';
import ReportsPage from '@/features/reports/pages/ReportsPage';
import ProfilePage from '@/features/users/pages/ProfilePage';
import SettingsPage from '@/features/settings/pages/SettingsPage';
import NotificationsPage from '@/features/notifications/pages/NotificationsPage';
import { ActivityLogsPage } from '@/features/activity/pages/ActivityLogsPage';
import RolesPage from '@/features/users/pages/RolesPage';
import PositionsPage from '@/features/users/pages/PositionsPage';

// Guards
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { PublicRoute } from '../routes/PublicRoute';
import { RoleProtectedRoute } from '../routes/RoleProtectedRoute';
import { ROUTES } from '@/utils/constants';

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
