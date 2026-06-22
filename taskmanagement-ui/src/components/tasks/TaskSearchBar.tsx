import { Search, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TaskSearchBarProps {
  onSearch: (keyword: string) => void;
  onAddTask: () => void;
}

export const TaskSearchBar = ({ onSearch, onAddTask }: TaskSearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm, onSearch]);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-surface-400 dark:text-surface-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl leading-5 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm shadow-sm transition-all"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <button
        onClick={onAddTask}
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2 -ml-1" />
        New Task
      </button>
    </div>
  );
};
