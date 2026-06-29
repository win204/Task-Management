import { Search, Plus, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { TaskSearchParams } from '../../types/task';

interface TaskSearchBarProps {
  onSearch: (params: TaskSearchParams) => void;
  onAddTask: () => void;
}

export const TaskSearchBar = ({ onSearch, onAddTask }: TaskSearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch({
        keyword: searchTerm,
        status,
        priority,
        assigneeId: assigneeId ? parseInt(assigneeId) : undefined,
        projectId: projectId ? parseInt(projectId) : undefined,
        dueDate
      });
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm, status, priority, assigneeId, projectId, dueDate, onSearch]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-surface-400 dark:text-surface-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-surface-300 dark:border-surface-600 rounded-xl leading-5 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm shadow-sm transition-all"
            placeholder="Search tasks by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className={`inline-flex items-center justify-center px-4 py-2.5 border rounded-xl shadow-sm text-sm font-medium transition-colors ${
            isAdvancedOpen 
              ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-400' 
              : 'border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-700'
          }`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {isAdvancedOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
        </button>
        
        <button
          onClick={onAddTask}
          className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2 -ml-1" />
          New Task
        </button>
      </div>

      {isAdvancedOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700/50 animate-in slide-in-from-top-2 duration-200">
          <div>
            <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full py-1.5 px-3 border border-surface-300 dark:border-surface-600 rounded-lg text-sm bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">Review</option>
              <option value="DONE">Done</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full py-1.5 px-3 border border-surface-300 dark:border-surface-600 rounded-lg text-sm bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">Assignee ID</label>
            <input
              type="number"
              placeholder="e.g. 1"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full py-1.5 px-3 border border-surface-300 dark:border-surface-600 rounded-lg text-sm bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">Project ID</label>
            <input
              type="number"
              placeholder="e.g. 1"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full py-1.5 px-3 border border-surface-300 dark:border-surface-600 rounded-lg text-sm bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full py-1.5 px-3 border border-surface-300 dark:border-surface-600 rounded-lg text-sm bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
