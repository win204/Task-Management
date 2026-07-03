import { X } from 'lucide-react';
import { UserForm } from './UserForm';
import { useUpdateUserMutation } from '@/features/users/hooks/useUsers';
import type { User, UpdateUserPayload } from '@/features/users/types/user';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const EditUserModal = ({ isOpen, onClose, user }: EditUserModalProps) => {
  const { mutateAsync: updateUser, isPending } = useUpdateUserMutation();

  if (!isOpen || !user) return null;

  const handleSubmit = async (data: UpdateUserPayload) => {
    try {
      await updateUser({ userId: user.id, payload: data });
      onClose();
    } catch (error) {
      // Error handled by mutation hook via toast
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
             <h2 className="text-lg font-semibold text-slate-800">Edit User</h2>
             <p className="text-xs text-slate-500">@{user.username}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <UserForm 
          mode="edit"
          defaultValues={{
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            roles: user.roles,
            active: user.active,
          }}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isPending}
        />
      </div>
    </div>
  );
};
