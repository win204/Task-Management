import { Eye, Edit2, Trash2, LayoutGrid } from 'lucide-react';
import type { Project } from '../../types/project';

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
      <div className="p-8 text-center bg-red-50 border-b border-red-100">
        <p className="text-red-600 font-medium">Failed to load projects.</p>
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      </div>
    );
  }

  if (isLoading && projects.length === 0) {
    return (
      <div className="animate-pulse flex flex-col">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex border-b border-slate-100 p-4 space-x-4">
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
            <div className="h-8 w-24 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <LayoutGrid className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">No projects found</h3>
        <p className="text-slate-500 mt-1">Get started by creating a new project.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Completed</span>;
      case 'IN_PROGRESS':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Progress</span>;
      case 'ON_HOLD':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">On Hold</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Project Details
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Timeline
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
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center rounded-lg font-bold">
                    {project.projectCode.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="ml-4 max-w-[300px]">
                    <div className="text-sm font-medium text-slate-900 truncate" title={project.projectName}>
                      {project.projectName}
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      {project.projectCode}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-900">
                  {project.startDate}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <span className="text-slate-400">to</span> {project.endDate || 'Ongoing'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(project.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onView(project)}
                    className="text-slate-600 hover:text-slate-900 bg-slate-50 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(project)}
                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1.5 rounded-md hover:bg-indigo-100 transition-colors"
                    title="Edit Project"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(project)}
                    className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md hover:bg-red-100 transition-colors"
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
