import { AlertTriangle, X } from 'lucide-react';
import type { User } from '@/features/users/types/user';
import { useDeleteUserMutation } from '@/features/users/hooks/useUsers';

interface DeleteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const DeleteUserDialog = ({ isOpen, onClose, user }: DeleteUserDialogProps) => {
  const { mutateAsync: deleteUser, isPending } = useDeleteUserMutation();

  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    try {
      await deleteUser(user.id);
      onClose();
    } catch (error) {
      // Error handled by mutation hook via toast
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
               <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
               <h2 className="text-lg font-semibold text-slate-900">Delete User</h2>
               <p className="text-sm text-slate-500 mt-1">
                 Are you sure you want to delete <strong>{user.fullName}</strong>? This action cannot be undone.
               </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Deleting...' : 'Yes, Delete User'}
          </button>
        </div>
      </div>
    </div>
  );
};
