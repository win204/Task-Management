import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, ChevronsLeft, ChevronsRight, X } from 'lucide-react';
import { SIDEBAR_MENU } from '../../constants/menu';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar = ({ collapsed, onToggleCollapse, mobileOpen, onMobileClose }: SidebarProps) => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Filter menu items based on the user's role
  const visibleMenuItems = useMemo(() => {
    if (!user || !user.roles) return [];

    return SIDEBAR_MENU.filter((item) => {
      // If the item requires specific roles, check if user has at least one of them
      if (item.roles && item.roles.length > 0) {
        return item.roles.some((role) => user.roles.includes(role));
      }
      // If no specific roles required, it's public/accessible to all authenticated users
      return true;
    });
  }, [user]);

  const sidebarContent = (
    <>
      {/* Brand Header */}
      <div className={`flex items-center h-16 border-b border-surface-800 dark:border-surface-800 px-4 flex-shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-sm font-black text-white shadow-lg shadow-primary-600/30 flex-shrink-0">
            TF
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-white tracking-tight whitespace-nowrap">
              TaskFlow
            </span>
          )}
        </div>
        {/* Desktop collapse toggle */}
        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-surface-400 hover:text-white hover:bg-surface-700 transition-colors"
            aria-label="Collapse sidebar"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}
        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden flex items-center justify-center w-7 h-7 rounded-md text-surface-400 hover:text-white hover:bg-surface-700 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <div className="hidden lg:flex justify-center py-3 border-b border-surface-800">
          <button
            onClick={onToggleCollapse}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-surface-400 hover:text-white hover:bg-surface-700 transition-colors"
            aria-label="Expand sidebar"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1" role="navigation" aria-label="Main navigation">
          {visibleMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `group relative flex items-center rounded-xl font-medium transition-all duration-200 ${
                  collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-primary-600/15 text-primary-400'
                    : 'text-surface-400 hover:bg-surface-800/60 hover:text-surface-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary-500 rounded-r-full" />
                  )}
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer User Area */}
      <div className="flex-shrink-0 p-3 border-t border-surface-800">
        {/* User mini-card */}
        {user && !collapsed && (
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl bg-surface-800/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-200 truncate">
                {user.fullName || user.username}
              </p>
              <p className="text-xs text-surface-500 truncate">
                {user.roles?.[0] || 'Member'}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`flex items-center w-full rounded-xl font-medium text-surface-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 ${
            collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-20 bg-surface-900 dark:bg-surface-900 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-surface-900 dark:bg-surface-900 flex flex-col transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
