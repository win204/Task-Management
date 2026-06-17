import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { SIDEBAR_MENU } from '../../constants/menu';
import { useAuthStore } from '../../store/authStore';

export const Sidebar = () => {
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

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 flex flex-col z-20 transition-transform transform">
      {/* Brand Header */}
      <div className="flex items-center justify-center h-16 border-b border-slate-800 px-4">
        <h1 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-sm font-black">
            TM
          </div>
          TaskFlow
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="space-y-1">
          {visibleMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-indigo-600/10 text-indigo-400'
                    : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer User Area / Quick Actions */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
