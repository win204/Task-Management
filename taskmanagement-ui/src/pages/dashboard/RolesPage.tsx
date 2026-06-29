import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Plus, Edit2, Trash2 } from 'lucide-react';
import { RoleService, type Role } from '../../services/RoleService';
import { Pagination } from '../../components/users/Pagination';
import toast from 'react-hot-toast';

export default function RolesPage() {
  const [page, setPage] = useState(0);
  const size = 10;
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState<Role | null>(null);
  const [roleName, setRoleName] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['roles', page],
    queryFn: () => RoleService.getRoles(page, size),
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => RoleService.createRole(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role created successfully');
      setRoleName('');
    },
    onError: () => toast.error('Failed to create role')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: number, name: string }) => RoleService.updateRole(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role updated successfully');
      setIsEditing(null);
      setRoleName('');
    },
    onError: () => toast.error('Failed to update role')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => RoleService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role deleted successfully');
    },
    onError: () => toast.error('Failed to delete role')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return;
    
    if (isEditing) {
      updateMutation.mutate({ id: isEditing.id, name: roleName });
    } else {
      createMutation.mutate(roleName);
    }
  };

  const handleEdit = (role: Role) => {
    setIsEditing(role);
    setRoleName(role.name);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setRoleName('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">Role Management</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Manage system roles and access levels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5 shadow-sm sticky top-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-500" /> 
              {isEditing ? 'Edit Role' : 'Create Role'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Role Name</label>
                <input
                  type="text"
                  required
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. ROLE_MANAGER"
                  className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isEditing ? 'Update' : 'Create'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-xl text-sm font-medium hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-50/50 dark:bg-surface-800/30 border-b border-surface-200 dark:border-surface-700/50 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Role Name</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-700/50 text-sm">
                  {isLoading ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-surface-500">Loading roles...</td>
                    </tr>
                  ) : !data || data.content.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-surface-500">No roles found.</td>
                    </tr>
                  ) : (
                    data.content.map((role) => (
                      <tr key={role.id} className="hover:bg-surface-50/50 dark:hover:bg-surface-800/50 transition-colors">
                        <td className="px-6 py-4 text-surface-500 font-medium">#{role.id}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 border border-primary-200/50 dark:border-primary-800/50">
                            {role.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(role)}
                              className="p-1.5 text-surface-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this role?')) {
                                  deleteMutation.mutate(role.id);
                                }
                              }}
                              className="p-1.5 text-surface-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {data && data.totalPages > 1 && (
              <div className="p-4 border-t border-surface-200 dark:border-surface-700/50">
                <Pagination
                  currentPage={data.number}
                  totalPages={data.totalPages}
                  totalElements={data.totalElements}
                  pageSize={data.size}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
