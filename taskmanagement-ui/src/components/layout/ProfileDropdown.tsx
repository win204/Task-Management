// ProfileDropdown component
import { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const ProfileDropdown = () => {
  const { user, logout } = useAuthStore();
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
        className="flex items-center gap-3 focus:outline-none p-1 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <div className="flex flex-col items-end hidden md:flex">
          <span className="text-sm font-semibold text-slate-700 leading-tight">
            {user.fullName || user.username}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {user.roles.join(', ')}
          </span>
        </div>
        
        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold border border-indigo-200 shadow-sm">
          {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
        </div>
        
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 transform origin-top-right transition-all">
          <div className="px-4 py-3 border-b border-slate-100 md:hidden">
            <p className="text-sm font-semibold text-slate-800">{user.fullName || user.username}</p>
            <p className="text-xs text-slate-500 truncate">{user.email || user.roles.join(', ')}</p>
          </div>
          
          <button
            onClick={() => {
              setIsOpen(false);
              // Future: Navigate to profile settings
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left transition-colors"
          >
            <User className="w-4 h-4 text-slate-400" />
            My Profile
          </button>
          
          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors mt-1"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};
