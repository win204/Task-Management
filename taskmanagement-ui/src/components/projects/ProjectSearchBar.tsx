import { Search, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProjectSearchBarProps {
  onSearch: (keyword: string) => void;
  onAddProject: () => void;
}

export const ProjectSearchBar = ({ onSearch, onAddProject }: ProjectSearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce the search input to avoid hitting the API on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, 400); // 400ms delay

    return () => clearTimeout(handler);
  }, [searchTerm, onSearch]);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
          placeholder="Search projects by keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <button
        onClick={onAddProject}
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2 -ml-1" />
        New Project
      </button>
    </div>
  );
};
