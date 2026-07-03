import { Edit2, Trash2, Shield, Eye, Lock, Unlock } from 'lucide-react';
import type { User } from '@/features/users/types/user';
import { useLockUserMutation, useUnlockUserMutation } from '@/features/users/hooks/useUsers';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  error: Error | null;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UserTable = ({ users, isLoading, error, onView, onEdit, onDelete }: UserTableProps) => {
  const lockMutation = useLockUserMutation();
  const unlockMutation = useUnlockUserMutation();

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 dark:bg-red-500/10 border-b border-red-100 dark:border-red-500/20">
        <p className="text-red-600 dark:text-red-400 font-medium">Failed to load users.</p>
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      </div>
    );
  }

  if (isLoading && users.length === 0) {
    return (
      <div className="animate-pulse flex flex-col">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex border-b border-surface-100 dark:border-surface-700/50 p-4 space-x-4">
            <div className="h-10 w-10 bg-surface-200 dark:bg-surface-700 rounded-full"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/4"></div>
              <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-surface-400 dark:text-surface-500" />
        </div>
        <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100">No users found</h3>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Try adjusting your search or filters to find what you're looking for.</p>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    switch ((role || '').toUpperCase()) {
      case 'ADMIN': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
      case 'MANAGER': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      default: return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
    }
  };

  const handleToggleLock = (user: User) => {
    if (user.active) {
      if (confirm(`Are you sure you want to lock user ${user.username}?`)) {
        lockMutation.mutate(user.id);
      }
    } else {
      if (confirm(`Are you sure you want to unlock user ${user.username}?`)) {
        unlockMutation.mutate(user.id);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700/50 relative">
        <thead className="bg-surface-50 dark:bg-surface-800/80 sticky top-0 z-10 backdrop-blur-sm">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              User
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              Roles
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
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center rounded-full font-bold">
                    {(user.fullName || user.username || '').charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-surface-900 dark:text-surface-100">{user.fullName}</div>
                    <div className="text-sm text-surface-500 dark:text-surface-400">@{user.username}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-surface-900 dark:text-surface-100">{user.email}</div>
                <div className="text-sm text-surface-500 dark:text-surface-400">{user.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-2">
                  {user.roles?.map(role => (
                    <span key={role} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(role)}`}>
                      {role}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.active ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-surface-400"></span> Locked
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => handleToggleLock(user)}
                    disabled={lockMutation.isPending || unlockMutation.isPending}
                    className="text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 bg-amber-50 dark:bg-amber-500/10 p-1.5 rounded-md hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                    title={user.active ? "Lock User" : "Unlock User"}
                  >
                    {user.active ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => onView(user)}
                    className="text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200 bg-surface-50 dark:bg-surface-800 p-1.5 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(user)}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 bg-primary-50 dark:bg-primary-900/20 p-1.5 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                    title="Edit User"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 bg-red-50 dark:bg-red-500/10 p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                    title="Delete User"
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
