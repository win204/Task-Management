import { AlertTriangle, X } from 'lucide-react';
import { useDeleteTaskMutation } from '../../hooks/useTasks';
import type { Task } from '../../types/task';

interface DeleteTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export const DeleteTaskDialog = ({ isOpen, onClose, task }: DeleteTaskDialogProps) => {
  const { mutateAsync: deleteTask, isPending } = useDeleteTaskMutation();

  if (!isOpen || !task) return null;

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      onClose();
    } catch (error) {
      // Handled by hook
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Delete Task
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete the task <span className="font-semibold text-slate-900">"{task.title}"</span>? 
            This action cannot be undone.
          </p>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
};
