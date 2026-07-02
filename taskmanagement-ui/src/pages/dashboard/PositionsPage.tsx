import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Briefcase, Plus, Edit2, Trash2, Search, UserPlus, X } from 'lucide-react';
import { PositionService, type Position } from '../../services/PositionService';
import { UserService } from '../../services/UserService';
import { Pagination } from '../../components/users/Pagination';
import toast from 'react-hot-toast';

export default function PositionsPage() {
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const size = 10;
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState<Position | null>(null);
  const [positionName, setPositionName] = useState('');

  // Assign position to user
  const [assignPositionId, setAssignPositionId] = useState<number | null>(null);
  const [assignUserId, setAssignUserId] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['positions', page, keyword],
    queryFn: () =>
      keyword.trim()
        ? PositionService.searchPositions(keyword.trim(), page, size)
        : PositionService.getPositions(page, size),
  });

  const { data: users } = useQuery({
    queryKey: ['users-all'],
    queryFn: () => UserService.getAllUsers(),
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => PositionService.createPosition(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      toast.success('Position created successfully');
      setPositionName('');
    },
    onError: () => toast.error('Failed to create position')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: number, name: string }) => PositionService.updatePosition(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      toast.success('Position updated successfully');
      setIsEditing(null);
      setPositionName('');
    },
    onError: () => toast.error('Failed to update position')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => PositionService.deletePosition(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      toast.success('Position deleted successfully');
    },
    onError: () => toast.error('Failed to delete position')
  });

  const assignMutation = useMutation({
    mutationFn: ({ userId, positionId }: { userId: number, positionId: number }) =>
      PositionService.assignPositionToUser(userId, positionId),
    onSuccess: () => {
      toast.success('Position assigned to user successfully');
      setAssignPositionId(null);
      setAssignUserId('');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to assign position')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!positionName.trim()) return;
    if (isEditing) {
      updateMutation.mutate({ id: isEditing.id, name: positionName });
    } else {
      createMutation.mutate(positionName);
    }
  };

  const handleEdit = (position: Position) => {
    setIsEditing(position);
    setPositionName(position.name);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setPositionName('');
  };

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(searchInput);
    setPage(0);
  }, [searchInput]);

  const clearSearch = () => {
    setSearchInput('');
    setKeyword('');
    setPage(0);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">Position Management</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Manage employee titles and positions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar: Create / Edit Form */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary-500" />
              {isEditing ? 'Edit Position' : 'Create Position'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Position Name</label>
                <input
                  type="text"
                  required
                  value={positionName}
                  onChange={(e) => setPositionName(e.target.value)}
                  placeholder="e.g. Senior Developer"
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

          {/* Assign Position to User */}
          {assignPositionId && (
            <div className="bg-white dark:bg-surface-800 rounded-2xl border border-primary-200 dark:border-primary-800 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-primary-500" />
                  Assign to User
                </h3>
                <button onClick={() => { setAssignPositionId(null); setAssignUserId(''); }} className="text-surface-400 hover:text-surface-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-surface-500 mb-3">
                Assigning position: <span className="font-medium text-primary-600">{data?.content.find(p => p.id === assignPositionId)?.name}</span>
              </p>
              <select
                value={assignUserId}
                onChange={(e) => setAssignUserId(e.target.value)}
                className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm mb-3"
              >
                <option value="">Select user...</option>
                {(users || []).map((u: any) => (
                  <option key={u.id} value={u.id}>{u.fullName || u.username} ({u.username})</option>
                ))}
              </select>
              <button
                disabled={!assignUserId || assignMutation.isPending}
                onClick={() => assignMutation.mutate({ userId: parseInt(assignUserId), positionId: assignPositionId })}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                Assign Position
              </button>
            </div>
          )}
        </div>

        {/* Main table */}
        <div className="md:col-span-2">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder="Search positions..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-9 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
              {searchInput && (
                <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
              Search
            </button>
          </form>

          <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-50/50 dark:bg-surface-800/30 border-b border-surface-200 dark:border-surface-700/50 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Position Name</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-700/50 text-sm">
                  {isLoading ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-surface-500">Loading positions...</td>
                    </tr>
                  ) : !data || data.content.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-surface-500">
                        {keyword ? `No positions found for "${keyword}"` : 'No positions found.'}
                      </td>
                    </tr>
                  ) : (
                    data.content.map((position) => (
                      <tr key={position.id} className="hover:bg-surface-50/50 dark:hover:bg-surface-800/50 transition-colors">
                        <td className="px-6 py-4 text-surface-500 font-medium">#{position.id}</td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-surface-900 dark:text-surface-100">{position.name}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => { setAssignPositionId(position.id); setAssignUserId(''); }}
                              title="Assign to User"
                              className="p-1.5 text-surface-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                            >
                              <UserPlus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(position)}
                              className="p-1.5 text-surface-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this position?')) {
                                  deleteMutation.mutate(position.id);
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
