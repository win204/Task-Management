import { useState } from 'react';
import { TaskSearchBar } from '../../components/tasks/TaskSearchBar';
import { TaskTable } from '../../components/tasks/TaskTable';
import { Pagination } from '../../components/users/Pagination'; 
import { CreateTaskModal } from '../../components/tasks/CreateTaskModal';
import { EditTaskModal } from '../../components/tasks/EditTaskModal';
import { TaskDetailModal } from '../../components/tasks/TaskDetailModal';
import { DeleteTaskDialog } from '../../components/tasks/DeleteTaskDialog';
import { useTasksQuery } from '../../hooks/useTasks';
import type { Task, TaskSearchParams } from '../../types/task';
import { KanbanSquare } from 'lucide-react';

export default function TasksPage() {
  const [searchParams, setSearchParams] = useState<TaskSearchParams>({
    page: 0,
    size: 10,
    keyword: '',
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, isLoading, error } = useTasksQuery(searchParams);

  const handleSearch = (keyword: string) => {
    setSearchParams(prev => ({ ...prev, keyword, page: 0 }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  const handleView = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleDelete = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Task Management</h1>
        <button 
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md font-medium text-sm transition-colors"
          title="Phase 7 Upcoming Feature"
        >
          <KanbanSquare className="w-4 h-4" />
          Kanban Board (Coming Soon)
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <TaskSearchBar onSearch={handleSearch} onAddTask={() => setIsCreateModalOpen(true)} />
        </div>

        <div className="flex-1 overflow-auto">
          <TaskTable 
            tasks={data?.content || []} 
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
      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      
      <TaskDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => { setIsDetailModalOpen(false); setSelectedTask(null); }} 
        task={selectedTask} 
      />

      <EditTaskModal 
        isOpen={isEditModalOpen} 
        onClose={() => { setIsEditModalOpen(false); setSelectedTask(null); }} 
        task={selectedTask} 
      />
      
      <DeleteTaskDialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => { setIsDeleteDialogOpen(false); setSelectedTask(null); }} 
        task={selectedTask} 
      />
    </div>
  );
}
