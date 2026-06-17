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
      <div className="p-8 text-center bg-red-50 border-b border-red-100">
        <p className="text-red-600 font-medium">Failed to load tasks.</p>
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      </div>
    );
  }

  if (isLoading && tasks.length === 0) {
    return (
      <div className="animate-pulse flex flex-col">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex border-b border-slate-100 p-4 space-x-4">
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
            <div className="h-8 w-16 bg-slate-200 rounded"></div>
            <div className="h-8 w-24 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <LayoutList className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">No tasks found</h3>
        <p className="text-slate-500 mt-1">Get started by creating a new task.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Task
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Project & Assignee
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Priority
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-slate-900 truncate max-w-[250px]" title={task.title}>
                  {task.title}
                </div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <span className="text-slate-400">Due:</span> {task.dueDate}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-slate-900 font-medium">
                  {task.projectName}
                </div>
                <div className="text-xs text-slate-500 mt-1">
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
                    className="text-slate-600 hover:text-slate-900 bg-slate-50 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(task)}
                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1.5 rounded-md hover:bg-indigo-100 transition-colors"
                    title="Edit Task"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(task)}
                    className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md hover:bg-red-100 transition-colors"
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
