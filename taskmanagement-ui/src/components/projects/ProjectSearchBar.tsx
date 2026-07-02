import { Search, Plus, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProjectSearchBarProps {
  onSearch: (keyword: string, status: string) => void;
  onAddProject: () => void;
}

export const ProjectSearchBar = ({ onSearch, onAddProject }: ProjectSearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Debounce the search input to avoid hitting the API on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm, statusFilter);
    }, 400); // 400ms delay

    return () => clearTimeout(handler);
  }, [searchTerm, statusFilter, onSearch]);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-surface-400 dark:text-surface-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl leading-5 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all shadow-sm"
          placeholder="Search projects by keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="relative min-w-[160px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Filter className="h-4 w-4 text-surface-400 dark:text-surface-500" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block w-full pl-10 pr-8 py-2 border border-surface-300 dark:border-surface-600 rounded-xl leading-5 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all shadow-sm appearance-none"
        >
          <option value="">All</option>
          <option value="PLANNING">Planning</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="ON_HOLD">On Hold</option>
        </select>
      </div>

      <button
        onClick={onAddProject}
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2 -ml-1" />
        New Project
      </button>
    </div>
  );
};
