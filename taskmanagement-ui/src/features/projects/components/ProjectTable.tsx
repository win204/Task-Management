import { Eye, Edit2, Trash2, LayoutGrid } from 'lucide-react';
import type { Project } from '@/features/projects/types/project';

interface ProjectTableProps {
  projects: Project[];
  isLoading: boolean;
  error: Error | null;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export const ProjectTable = ({ projects, isLoading, error, onView, onEdit, onDelete }: ProjectTableProps) => {
  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 dark:bg-red-500/10 border-b border-red-100 dark:border-red-500/20">
        <p className="text-red-600 dark:text-red-400 font-medium">Failed to load projects.</p>
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      </div>
    );
  }

  if (isLoading && projects.length === 0) {
    return (
      <div className="animate-pulse flex flex-col">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex border-b border-surface-100 dark:border-surface-700/50 p-4 space-x-4">
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/4"></div>
              <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-1/2"></div>
            </div>
            <div className="h-8 w-24 bg-surface-200 dark:bg-surface-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mb-4">
          <LayoutGrid className="w-8 h-8 text-surface-400 dark:text-surface-500" />
        </div>
        <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100">No projects found</h3>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Get started by creating a new project.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch ((status || '').toUpperCase()) {
      case 'COMPLETED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">Completed</span>;
      case 'IN_PROGRESS':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400">In Progress</span>;
      case 'ON_HOLD':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400">On Hold</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-300">{status}</span>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700/50 relative">
        <thead className="bg-surface-50 dark:bg-surface-800/80 sticky top-0 z-10 backdrop-blur-sm">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              Project Details
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              Timeline
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
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-primary-50 text-primary-600 border border-primary-100 dark:bg-primary-900/30 dark:border-primary-500/20 dark:text-primary-400 flex items-center justify-center rounded-xl font-bold">
                    {(project.projectCode || '').substring(0, 2).toUpperCase()}
                  </div>
                  <div className="ml-4 max-w-[300px]">
                    <div className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate" title={project.projectName}>
                      {project.projectName}
                    </div>
                    <div className="text-xs text-surface-500 dark:text-surface-400 font-mono mt-0.5">
                      {project.projectCode}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-surface-900 dark:text-surface-100">
                  {project.startDate}
                </div>
                <div className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-1 mt-0.5">
                  <span className="text-surface-400 dark:text-surface-500">to</span> {project.endDate || 'Ongoing'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(project.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onView(project)}
                    className="text-surface-600 hover:text-surface-900 bg-surface-50 p-1.5 rounded-md hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(project)}
                    className="text-primary-600 hover:text-primary-900 bg-primary-50 p-1.5 rounded-md hover:bg-primary-100 dark:text-primary-400 dark:hover:text-primary-300 dark:bg-primary-900/20 dark:hover:bg-primary-900/40 transition-colors"
                    title="Edit Project"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(project)}
                    className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors"
                    title="Delete Project"
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
