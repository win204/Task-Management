import { useState } from 'react';
import { ProjectSearchBar } from '../../components/projects/ProjectSearchBar';
import { ProjectTable } from '../../components/projects/ProjectTable';
import { Pagination } from '../../components/users/Pagination'; // Reuse users pagination
import { CreateProjectModal } from '../../components/projects/CreateProjectModal';
import { EditProjectModal } from '../../components/projects/EditProjectModal';
import { ProjectDetailModal } from '../../components/projects/ProjectDetailModal';
import { DeleteProjectDialog } from '../../components/projects/DeleteProjectDialog';
import { useProjectsQuery } from '../../hooks/useProjects';
import type { Project, ProjectSearchParams } from '../../types/project';

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useState<ProjectSearchParams>({
    page: 0,
    size: 10,
    keyword: '',
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, isLoading, error } = useProjectsQuery(searchParams);

  const handleSearch = (keyword: string) => {
    setSearchParams(prev => ({ ...prev, keyword, page: 0 }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  const handleView = (project: Project) => {
    setSelectedProject(project);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Project Portfolio</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <ProjectSearchBar onSearch={handleSearch} onAddProject={() => setIsCreateModalOpen(true)} />
        </div>

        <div className="flex-1 overflow-auto">
          <ProjectTable 
            projects={data?.content || []} 
            isLoading={isLoading} 
            error={error as Error} 
            onView={handleView}
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </div>

        {data && (
           <Pagination 
             currentPage={data.number}
             totalPages={data.totalPages}
             totalElements={data.totalElements}
             pageSize={data.size}
             onPageChange={handlePageChange}
           />
        )}
      </div>

      {/* Modals */}
      <CreateProjectModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      
      <ProjectDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => { setIsDetailModalOpen(false); setSelectedProject(null); }} 
        project={selectedProject} 
      />

      <EditProjectModal 
        isOpen={isEditModalOpen} 
        onClose={() => { setIsEditModalOpen(false); setSelectedProject(null); }} 
        project={selectedProject} 
      />
      
      <DeleteProjectDialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => { setIsDeleteDialogOpen(false); setSelectedProject(null); }} 
        project={selectedProject} 
      />
    </div>
  );
}
