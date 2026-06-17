import { X } from 'lucide-react';
import { ProjectForm } from './ProjectForm';
import { useCreateProjectMutation } from '../../hooks/useProjects';
import type { CreateProjectPayload } from '../../types/project';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal = ({ isOpen, onClose }: CreateProjectModalProps) => {
  const { mutateAsync: createProject, isPending } = useCreateProjectMutation();

  if (!isOpen) return null;

  const handleSubmit = async (data: CreateProjectPayload) => {
    try {
      await createProject(data);
      onClose();
    } catch (error) {
      // Error handled by mutation hook via toast
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800">Create New Project</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <ProjectForm 
          mode="create"
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isPending}
        />
      </div>
    </div>
  );
};
