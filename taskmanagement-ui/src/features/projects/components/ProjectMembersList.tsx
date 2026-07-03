import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProjectMemberService, type AddProjectMemberRequest, type ProjectMemberResponse } from '@/features/projects/api/ProjectMemberService';
import { UserService } from '@/features/users/api/UserService';
import { Users, UserPlus, X, Shield, User, Edit2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProjectMembersList = ({ projectId, isAdmin }: { projectId: number, isAdmin: boolean }) => {
  const queryClient = useQueryClient();
  const [newUserId, setNewUserId] = useState('');
  const [newRole, setNewRole] = useState('MEMBER');
  
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingRole, setEditingRole] = useState('MEMBER');

  const { data: response, isLoading } = useQuery({
    queryKey: ['project-members', projectId],
    queryFn: () => ProjectMemberService.getMembers(projectId),
  });

  const { data: allUsers } = useQuery({
    queryKey: ['users-all'],
    queryFn: () => UserService.getAllUsers(),
    enabled: isAdmin,
  });

  const members = response?.data?.data || [];
  const memberUserIds = new Set(members.map((m: ProjectMemberResponse) => m.userId));

  const addMemberMutation = useMutation({
    mutationFn: (request: AddProjectMemberRequest) => ProjectMemberService.addMember(projectId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members', projectId] });
      setNewUserId('');
      toast.success('Member added successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId: number) => ProjectMemberService.removeMember(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members', projectId] });
      toast.success('Member removed');
    },
    onError: () => toast.error('Failed to remove member')
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number, role: string }) => ProjectMemberService.updateRole(projectId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members', projectId] });
      setEditingUserId(null);
      toast.success('Role updated');
    },
    onError: () => toast.error('Failed to update role')
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserId) return;
    addMemberMutation.mutate({ userId: parseInt(newUserId), role: newRole });
  };

  const handleSaveRole = (userId: number) => {
    updateRoleMutation.mutate({ userId, role: editingRole });
  };

  return (
    <div className="mt-8 border-t border-slate-100 pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-800 font-semibold">
          <Users className="w-5 h-5 text-indigo-500" />
          <h3>Project Members ({members.length})</h3>
        </div>
      </div>

      {/* Add Member Form (Admin/Manager only) */}
      {isAdmin && (
        <form onSubmit={handleAddMember} className="flex flex-wrap gap-2 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <select
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
            className="flex-grow min-w-0 text-sm rounded-md border border-slate-300 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            required
          >
            <option value="">Select user to add...</option>
            {(allUsers || []).filter((u: any) => !memberUserIds.has(u.id)).map((u: any) => (
              <option key={u.id} value={u.id}>{u.fullName || u.username} ({u.username})</option>
            ))}
          </select>
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="text-sm rounded-md border border-slate-300 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="MEMBER">Member</option>
            <option value="LEADER">Leader</option>
          </select>
          <button
            type="submit"
            disabled={addMemberMutation.isPending || !newUserId}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            Add
          </button>
        </form>
      )}

      {/* Members List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center text-sm text-slate-500 py-4">Loading members...</div>
        ) : members.length === 0 ? (
          <div className="text-center text-sm text-slate-400 py-4 italic">No members assigned yet.</div>
        ) : (
          members.map((member: ProjectMemberResponse) => (
            <div key={member.userId} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                  {member.fullName.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-sm text-slate-900">{member.fullName}</div>
                  <div className="text-xs text-slate-500">{member.username}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {editingUserId === member.userId ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={editingRole}
                      onChange={(e) => setEditingRole(e.target.value)}
                      className="text-xs rounded-md border border-slate-300 px-2 py-1 outline-none"
                    >
                      <option value="MEMBER">MEMBER</option>
                      <option value="LEADER">LEADER</option>
                    </select>
                    <button
                      onClick={() => handleSaveRole(member.userId)}
                      disabled={updateRoleMutation.isPending}
                      className="text-emerald-500 hover:bg-emerald-50 p-1 rounded-md transition-colors"
                      title="Save Role"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingUserId(null)}
                      className="text-slate-400 hover:bg-slate-50 p-1 rounded-md transition-colors"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      member.role === 'LEADER' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {member.role === 'LEADER' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {member.role}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setEditingUserId(member.userId);
                          setEditingRole(member.role);
                        }}
                        className="text-slate-400 hover:text-indigo-500 p-1 rounded-md hover:bg-indigo-50 transition-colors"
                        title="Change Role"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
                
                {isAdmin && (
                  <button
                    onClick={() => removeMemberMutation.mutate(member.userId)}
                    disabled={removeMemberMutation.isPending}
                    className="text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                    title="Remove member"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
