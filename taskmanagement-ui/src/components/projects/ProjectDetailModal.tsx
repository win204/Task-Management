import { X, Briefcase, Calendar, Info, Clock } from 'lucide-react';
import type { Project } from '../../types/project';
import { ProjectMembersList } from './ProjectMembersList';
import { useAuthStore } from '../../store/authStore';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const ProjectDetailModal = ({ isOpen, onClose, project }: ProjectDetailModalProps) => {
  const { user } = useAuthStore();
  if (!isOpen || !project) return null;

  const isAdminOrManager = user?.roles?.some(r => r === 'ROLE_ADMIN' || r === 'ROLE_MANAGER') || false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            Project Details
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{project.projectName}</h3>
              <p className="text-sm font-mono text-slate-500 mt-1 bg-slate-100 inline-block px-2 py-0.5 rounded border border-slate-200">
                {project.projectCode}
              </p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              project.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
              project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
              project.status === 'ON_HOLD' ? 'bg-amber-100 text-amber-800' :
              'bg-slate-100 text-slate-800'
            }`}>
              {project.status.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2 text-slate-700 font-medium mb-2">
                <Info className="w-4 h-4" />
                Description
              </div>
              <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-slate-700 font-medium mb-1">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </div>
                <p className="text-sm font-medium text-slate-900">{project.startDate}</p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-slate-700 font-medium mb-1">
                  <Clock className="w-4 h-4" />
                  Target End Date
                </div>
                <p className="text-sm font-medium text-slate-900">{project.endDate || 'Ongoing'}</p>
              </div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-500 font-mono text-center">
              Internal System ID: {project.id}
            </div>

            <ProjectMembersList projectId={project.id} isAdmin={isAdminOrManager} />
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
