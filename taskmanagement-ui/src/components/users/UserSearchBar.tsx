import { useState, useEffect } from 'react';
import { Search, UserPlus } from 'lucide-react';

interface UserSearchBarProps {
  onSearch: (keyword: string) => void;
  onAddUser: () => void;
}

export const UserSearchBar = ({ onSearch, onAddUser }: UserSearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search input to avoid hitting API on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onSearch]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="relative w-full sm:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-surface-400 dark:text-surface-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500"
          placeholder="Search by username, name, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <button
        onClick={onAddUser}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm"
      >
        <UserPlus className="w-4 h-4" />
        Add User
      </button>
    </div>
  );
};
