import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  BarChart3,
} from 'lucide-react';
import type { MenuItem } from '../types/menu';
import { ROUTES } from '../utils/constants';

/**
 * Centralized role-based menu configuration.
 * Determines which items appear in the Sidebar based on the user's role.
 */
export const SIDEBAR_MENU: MenuItem[] = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
  },
  {
    label: 'Users',
    path: '/dashboard/users',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    label: 'Projects',
    path: '/dashboard/projects',
    icon: Briefcase,
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    label: 'Tasks',
    path: '/dashboard/tasks',
    icon: CheckSquare,
    roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
  },
  {
    label: 'Reports',
    path: '/dashboard/reports',
    icon: BarChart3,
    roles: ['ADMIN', 'MANAGER'],
  },
];
