import { X } from 'lucide-react';
import { ProjectForm } from './ProjectForm';
import { useUpdateProjectMutation } from '../../hooks/useProjects';
import type { Project, UpdateProjectPayload } from '../../types/project';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const EditProjectModal = ({ isOpen, onClose, project }: EditProjectModalProps) => {
  const { mutateAsync: updateProject, isPending } = useUpdateProjectMutation();

  if (!isOpen || !project) return null;

  const handleSubmit = async (data: UpdateProjectPayload) => {
    try {
      await updateProject({ projectId: project.id, payload: data });
      onClose();
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Edit Project</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{project.projectCode}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <ProjectForm 
          mode="edit"
          defaultValues={{
            projectCode: project.projectCode,
            projectName: project.projectName,
            description: project.description,
            startDate: project.startDate,
            endDate: project.endDate,
            status: project.status as any,
          }}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isPending}
        />
      </div>
    </div>
  );
};
