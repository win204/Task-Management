import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
  /**
   * Display label for the sidebar.
   */
  label: string;
  /**
   * The destination route path.
   */
  path: string;
  /**
   * The icon component to display next to the label.
   */
  icon: LucideIcon;
  /**
   * Array of roles allowed to view and access this menu item.
   * If empty or undefined, it means everyone authenticated can access it.
   */
  roles: string[];
}
