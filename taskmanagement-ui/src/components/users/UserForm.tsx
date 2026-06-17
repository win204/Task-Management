import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CreateUserPayload, UpdateUserPayload } from '../../types/user';

// --- Shared Zod Schemas ---
const baseUserSchema = {
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  roles: z.array(z.string()).min(1, 'Select at least one role'),
  active: z.boolean(),
};

// Create requires a password
export const createUserSchema = z.object({
  ...baseUserSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Update does not modify username or password directly here
export const updateUserSchema = z.object({
  email: baseUserSchema.email,
  fullName: baseUserSchema.fullName,
  phone: baseUserSchema.phone,
  roles: baseUserSchema.roles,
  active: baseUserSchema.active,
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

type UserFormProps = 
  | {
      mode: 'create';
      defaultValues?: Partial<CreateUserFormValues>;
      onSubmit: (data: CreateUserPayload) => Promise<void>;
      onCancel: () => void;
      isSubmitting: boolean;
    }
  | {
      mode: 'edit';
      defaultValues: UpdateUserFormValues;
      onSubmit: (data: UpdateUserPayload) => Promise<void>;
      onCancel: () => void;
      isSubmitting: boolean;
    };

export const UserForm = (props: UserFormProps) => {
  const { mode, defaultValues, onSubmit, onCancel, isSubmitting } = props;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(mode === 'create' ? createUserSchema : updateUserSchema),
    defaultValues: defaultValues as any,
  });

  // Keep form in sync if initial values change (especially for edit mode)
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const handleFormSubmit = async (data: any) => {
    await onSubmit(data);
    if (mode === 'create') {
      reset(); // clear form only on successful creation
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mode === 'create' && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Username *</label>
            <input 
              {...register('username')} 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
            />
            {errors.username && <p className="text-xs text-red-500">{errors.username.message as string}</p>}
          </div>
        )}
        
        <div className={`space-y-1 ${mode === 'edit' ? 'sm:col-span-2' : ''}`}>
          <label className="text-sm font-medium text-slate-700">Full Name *</label>
          <input 
            {...register('fullName')} 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
          />
          {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message as string}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Email *</label>
          <input 
            type="email" 
            {...register('email')} 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message as string}</p>}
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Phone *</label>
          <input 
            {...register('phone')} 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message as string}</p>}
        </div>
      </div>

      {mode === 'create' && (
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Initial Password *</label>
          <input 
            type="password" 
            {...register('password')} 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message as string}</p>}
        </div>
      )}

      <div className="space-y-1 pt-2 border-t border-slate-100">
        <label className="text-sm font-medium text-slate-700">Role Mapping *</label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" value="EMPLOYEE" {...register('roles')} className="rounded text-indigo-600 focus:ring-indigo-500" />
            Employee
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" value="MANAGER" {...register('roles')} className="rounded text-indigo-600 focus:ring-indigo-500" />
            Manager
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" value="ADMIN" {...register('roles')} className="rounded text-indigo-600 focus:ring-indigo-500" />
            Admin
          </label>
        </div>
        {errors.roles && <p className="text-xs text-red-500">{errors.roles.message as string}</p>}
      </div>

      <div className="flex items-center gap-2 pt-2">
         <input type="checkbox" id={`active-${mode}`} {...register('active')} className="rounded text-indigo-600 focus:ring-indigo-500" />
         <label htmlFor={`active-${mode}`} className="text-sm text-slate-700">Active Account</label>
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
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create User' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};
