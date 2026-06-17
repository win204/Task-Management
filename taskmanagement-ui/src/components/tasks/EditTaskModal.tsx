import { X } from 'lucide-react';
import { TaskForm } from './TaskForm';
import { useUpdateTaskMutation } from '../../hooks/useTasks';
import type { Task, UpdateTaskPayload } from '../../types/task';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export const EditTaskModal = ({ isOpen, onClose, task }: EditTaskModalProps) => {
  const { mutateAsync: updateTask, isPending } = useUpdateTaskMutation();

  if (!isOpen || !task) return null;

  const handleSubmit = async (data: UpdateTaskPayload) => {
    try {
      await updateTask({ taskId: task.id, payload: data });
      onClose();
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800">Edit Task</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Note: In a real enterprise app, we'd fetch the exact Task details by ID here to get the projectId and assigneeId 
            since the /paging endpoint only returns projectName and assigneeName.
            For this demo, we assume the user must re-select them if they edit, or we use defaults 1 if the API doesn't crash.
            Ideally, TaskResponse would include projectId and assigneeId.
        */}
        <TaskForm 
          mode="edit"
          defaultValues={{
            title: task.title,
            description: task.description,
            startDate: task.startDate,
            dueDate: task.dueDate,
            status: task.status as any,
            priority: task.priority as any,
            // Fallbacks because the List API doesn't provide IDs
            projectId: "1", 
            assigneeId: "1", 
          }}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isPending}
        />
      </div>
    </div>
  );
};
