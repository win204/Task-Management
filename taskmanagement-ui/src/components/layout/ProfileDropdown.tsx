import { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export const ProfileDropdown = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 focus:outline-none p-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-semibold text-surface-700 dark:text-surface-200 leading-tight">
            {user.fullName || user.username}
          </span>
          <span className="text-[11px] text-surface-500 dark:text-surface-500 font-medium">
            {user.roles?.[0] || 'Member'}
          </span>
        </div>

        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
          {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-surface-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-surface-800 rounded-xl shadow-xl dark:shadow-2xl border border-surface-100 dark:border-surface-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-surface-100 dark:border-surface-700">
            <p className="text-sm font-semibold text-surface-800 dark:text-surface-100">
              {user.fullName || user.username}
            </p>
            <p className="text-xs text-surface-500 dark:text-surface-400 truncate mt-0.5">
              {user.email || user.roles.join(', ')}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => { setIsOpen(false); navigate('/dashboard/profile'); }}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50 w-full text-left transition-colors"
            >
              <User className="w-4 h-4 text-surface-400 dark:text-surface-500" />
              My Profile
            </button>
            <button
              onClick={() => { setIsOpen(false); navigate('/dashboard/settings'); }}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50 w-full text-left transition-colors"
            >
              <Settings className="w-4 h-4 text-surface-400 dark:text-surface-500" />
              Settings
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-surface-100 dark:border-surface-700 pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 w-full text-left transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
