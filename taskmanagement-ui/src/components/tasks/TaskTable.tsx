import { Eye, Edit2, Trash2, LayoutList } from 'lucide-react';
import type { Task } from '../../types/task';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TaskPriorityBadge } from './TaskPriorityBadge';

interface TaskTableProps {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskTable = ({ tasks, isLoading, error, onView, onEdit, onDelete }: TaskTableProps) => {
  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 dark:bg-red-500/10 border-b border-red-100 dark:border-red-500/20">
        <p className="text-red-600 dark:text-red-400 font-medium">Failed to load tasks.</p>
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      </div>
    );
  }

  if (isLoading && tasks.length === 0) {
    return (
      <div className="animate-pulse flex flex-col">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex border-b border-surface-100 dark:border-surface-700/50 p-4 space-x-4">
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/3"></div>
              <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-1/2"></div>
            </div>
            <div className="h-8 w-16 bg-surface-200 dark:bg-surface-700 rounded"></div>
            <div className="h-8 w-24 bg-surface-200 dark:bg-surface-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mb-4">
          <LayoutList className="w-8 h-8 text-surface-400 dark:text-surface-500" />
        </div>
        <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100">No tasks found</h3>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Get started by creating a new task.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700/50 relative">
        <thead className="bg-surface-50 dark:bg-surface-800/80 sticky top-0 z-10 backdrop-blur-sm">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              Task
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              Project & Assignee
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              Priority
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-surface-900/20 divide-y divide-surface-200 dark:divide-surface-700/50">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate max-w-[250px]" title={task.title}>
                  {task.title}
                </div>
                <div className="text-xs text-surface-500 dark:text-surface-400 mt-1 flex items-center gap-1">
                  <span className="text-surface-400 dark:text-surface-500">Due:</span> {task.dueDate}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-surface-900 dark:text-surface-100 font-medium">
                  {task.projectName}
                </div>
                <div className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                  {task.assigneeName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <TaskPriorityBadge priority={task.priority} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <TaskStatusBadge status={task.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onView(task)}
                    className="text-surface-600 hover:text-surface-900 bg-surface-50 p-1.5 rounded-md hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(task)}
                    className="text-primary-600 hover:text-primary-900 bg-primary-50 p-1.5 rounded-md hover:bg-primary-100 dark:text-primary-400 dark:hover:text-primary-300 dark:bg-primary-900/20 dark:hover:bg-primary-900/40 transition-colors"
                    title="Edit Task"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(task)}
                    className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
