import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUsersQuery } from '../../hooks/useUsers';
import { useProjectsQuery } from '../../hooks/useProjects';
import type { CreateTaskPayload, UpdateTaskPayload } from '../../types/task';
import { Loader2 } from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description is too short'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']),
  startDate: z.string().min(1, 'Start date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  projectId: z.string().min(1, 'Project must be selected'),
  assigneeId: z.string().min(1, 'Assignee must be selected'),
}).refine(data => {
  return new Date(data.dueDate) >= new Date(data.startDate);
}, {
  message: "Due date cannot be before start date",
  path: ["dueDate"]
});

export type TaskFormValues = z.infer<typeof taskSchema>;

type TaskFormProps = 
  | {
      mode: 'create';
      defaultValues?: Partial<TaskFormValues>;
      onSubmit: (data: CreateTaskPayload) => Promise<void>;
      onCancel: () => void;
      isSubmitting: boolean;
    }
  | {
      mode: 'edit';
      defaultValues: TaskFormValues;
      onSubmit: (data: UpdateTaskPayload) => Promise<void>;
      onCancel: () => void;
      isSubmitting: boolean;
    };

export const TaskForm = (props: TaskFormProps) => {
  const { mode, defaultValues, onSubmit, onCancel, isSubmitting } = props;

  // Fetch relational data for dropdowns (fetch large chunk to ensure all options are available)
  const { data: usersData, isLoading: isLoadingUsers } = useUsersQuery({ page: 0, size: 100 });
  const { data: projectsData, isLoading: isLoadingProjects } = useProjectsQuery({ page: 0, size: 100 });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: defaultValues || {
      status: 'TODO',
      priority: 'MEDIUM',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +7 days
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues ? JSON.stringify(defaultValues) : null, reset]);

  const handleFormSubmit = async (data: TaskFormValues) => {
    const payload = {
      ...data,
      projectId: Number(data.projectId),
      assigneeId: Number(data.assigneeId),
    };
    await onSubmit(payload as any);
    if (mode === 'create') {
      reset();
    }
  };

  const isLoadingRelational = isLoadingUsers || isLoadingProjects;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit as any)} className="p-6 space-y-4">
      {isLoadingRelational && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-b-xl">
          <div className="flex items-center gap-2 text-indigo-600 bg-white px-4 py-2 rounded-lg shadow-sm border border-indigo-100">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Loading dependencies...</span>
          </div>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Task Title *</label>
        <input 
          {...register('title')} 
          placeholder="Implement login page"
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm" 
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Description *</label>
        <textarea 
          {...register('description')} 
          rows={3}
          placeholder="Detailed acceptance criteria..."
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none shadow-sm" 
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Project *</label>
          <select 
            {...register('projectId')} 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white shadow-sm disabled:bg-slate-50"
            disabled={isLoadingProjects}
          >
            <option value="">Select a project...</option>
            {projectsData?.content.map(p => (
              <option key={p.id} value={p.id}>{p.projectCode} - {p.projectName}</option>
            ))}
          </select>
          {errors.projectId && <p className="text-xs text-red-500">{errors.projectId.message}</p>}
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Assignee *</label>
          <select 
            {...register('assigneeId')} 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white shadow-sm disabled:bg-slate-50"
            disabled={isLoadingUsers}
          >
            <option value="">Select an assignee...</option>
            {usersData?.content.map(u => (
              <option key={u.id} value={u.id}>{u.fullName} ({u.username})</option>
            ))}
          </select>
          {errors.assigneeId && <p className="text-xs text-red-500">{errors.assigneeId.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1 border-t border-slate-100 pt-3">
          <label className="text-sm font-medium text-slate-700">Status</label>
          <select 
            {...register('status')} 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white shadow-sm"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">In Review</option>
            <option value="DONE">Done</option>
          </select>
          {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
        </div>

        <div className="space-y-1 border-t border-slate-100 pt-3">
          <label className="text-sm font-medium text-slate-700">Priority</label>
          <select 
            {...register('priority')} 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white shadow-sm"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
          {errors.priority && <p className="text-xs text-red-500">{errors.priority.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Start Date *</label>
          <input 
            type="date" 
            {...register('startDate')} 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm" 
          />
          {errors.startDate && <p className="text-xs text-red-500">{errors.startDate.message}</p>}
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Due Date *</label>
          <input 
            type="date" 
            {...register('dueDate')} 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm" 
          />
          {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate.message}</p>}
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
        <button 
          type="button" 
          onClick={onCancel} 
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting || isLoadingRelational || (mode === 'edit' && !isDirty)} 
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Task' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};
