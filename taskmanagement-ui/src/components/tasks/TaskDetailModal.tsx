import { X, Calendar, User, Briefcase, FileText } from 'lucide-react';
import type { Task } from '../../types/task';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TaskPriorityBadge } from './TaskPriorityBadge';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export const TaskDetailModal = ({ isOpen, onClose, task }: TaskDetailModalProps) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex gap-3 items-center">
            <TaskPriorityBadge priority={task.priority} />
            <h2 className="text-lg font-semibold text-slate-800">Task Details</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-6 gap-4">
            <h3 className="text-2xl font-bold text-slate-900 leading-tight">{task.title}</h3>
            <div className="flex-shrink-0 mt-1">
              <TaskStatusBadge status={task.status} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                <FileText className="w-4 h-4" />
                Description
              </div>
              <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                {task.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-indigo-500 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-500 font-medium mb-0.5">Project</div>
                  <div className="text-sm font-medium text-slate-900">{task.projectName}</div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-start gap-3">
                <User className="w-5 h-5 text-indigo-500 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-500 font-medium mb-0.5">Assignee</div>
                  <div className="text-sm font-medium text-slate-900">{task.assigneeName}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-500 font-medium mb-0.5">Start Date</div>
                  <div className="text-sm font-medium text-slate-900">{task.startDate}</div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-500 font-medium mb-0.5">Due Date</div>
                  <div className="text-sm font-medium text-slate-900">{task.dueDate}</div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
