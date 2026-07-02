import { Search, Bell, Menu, Sun, Moon } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';
import { ProfileDropdown } from './ProfileDropdown';
import { NotificationDropdown } from './NotificationDropdown';
import { useThemeStore } from '../../store/themeStore';

interface TopbarProps {
  onMobileMenuToggle: () => void;
  onSearchClick: () => void;
}

export const Topbar = ({ onMobileMenuToggle, onSearchClick }: TopbarProps) => {
  const { resolved, toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800 h-16 flex items-center justify-between px-4 md:px-6 lg:px-8">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Breadcrumb />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div 
          onClick={onSearchClick}
          className="hidden md:flex items-center gap-2 bg-surface-100 dark:bg-surface-800 rounded-xl px-3 py-2 text-surface-400 dark:text-surface-500 w-56 cursor-pointer hover:bg-surface-200/70 dark:hover:bg-surface-700/70 transition-colors"
        >
          <Search className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">Search...</span>
          <kbd className="ml-auto hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-surface-400 bg-white dark:bg-surface-700 rounded border border-surface-200 dark:border-surface-600">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          aria-label={`Switch to ${resolved === 'dark' ? 'light' : 'dark'} mode`}
        >
          {resolved === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-surface-200 dark:bg-surface-700 mx-1" />

        {/* Profile */}
        <ProfileDropdown />
      </div>
    </header>
  );
};
