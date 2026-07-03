import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CreateProjectPayload, UpdateProjectPayload } from '@/features/projects/types/project';

// Zod schema with complex date validation
const projectSchema = z.object({
  projectCode: z.string().min(2, 'Project code must be at least 2 characters'),
  projectName: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().nullable(),
}).refine(data => {
  if (!data.endDate) return true;
  return new Date(data.endDate) >= new Date(data.startDate);
}, {
  message: "End date cannot be before start date",
  path: ["endDate"]
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

type ProjectFormProps = 
  | {
      mode: 'create';
      defaultValues?: Partial<ProjectFormValues>;
      onSubmit: (data: CreateProjectPayload) => Promise<void>;
      onCancel: () => void;
      isSubmitting: boolean;
    }
  | {
      mode: 'edit';
      defaultValues: ProjectFormValues;
      onSubmit: (data: UpdateProjectPayload) => Promise<void>;
      onCancel: () => void;
      isSubmitting: boolean;
    };

export const ProjectForm = (props: ProjectFormProps) => {
  const { mode, defaultValues, onSubmit, onCancel, isSubmitting } = props;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues || {
      status: 'PLANNING',
      startDate: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
    // Deep compare to prevent infinite resets when parent re-renders and passes a new object reference
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues ? JSON.stringify(defaultValues) : null, reset]);

  const handleFormSubmit = async (data: ProjectFormValues) => {
    // Ensure empty string endDate is parsed as null for the backend
    const payload = {
      ...data,
      endDate: data.endDate ? data.endDate : null,
    };
    await onSubmit(payload);
    if (mode === 'create') {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Project Code *</label>
          <input 
            {...register('projectCode')} 
            placeholder="e.g. PRJ-001"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none uppercase" 
          />
          {errors.projectCode && <p className="text-xs text-red-500">{errors.projectCode.message}</p>}
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Project Name *</label>
          <input 
            {...register('projectName')} 
            placeholder="E-Commerce Redesign"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
          />
          {errors.projectName && <p className="text-xs text-red-500">{errors.projectName.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Description *</label>
        <textarea 
          {...register('description')} 
          rows={3}
          placeholder="Detailed description of the project goals..."
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none" 
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Start Date *</label>
          <input 
            type="date" 
            {...register('startDate')} 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
          />
          {errors.startDate && <p className="text-xs text-red-500">{errors.startDate.message}</p>}
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">End Date</label>
          <input 
            type="date" 
            {...register('endDate')} 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
          />
          {errors.endDate && <p className="text-xs text-red-500">{errors.endDate.message}</p>}
        </div>
      </div>

      <div className="space-y-1 border-t border-slate-100 pt-4">
        <label className="text-sm font-medium text-slate-700">Status</label>
        <select 
          {...register('status')} 
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
        >
          <option value="PLANNING">Planning</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="COMPLETED">Completed</option>
        </select>
        {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
        <button 
          type="button" 
          onClick={onCancel} 
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting || (mode === 'edit' && !isDirty)} 
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Project' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};
