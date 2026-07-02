import { useState } from 'react';
import { X, User as UserIcon, Mail, Phone, ShieldCheck, CheckCircle2, XCircle, ShieldPlus, Briefcase, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { User } from '../../types/user';
import { RoleService } from '../../services/RoleService';
import { PositionService } from '../../services/PositionService';
import { useAssignRoleMutation, useAssignPositionMutation } from '../../hooks/useUsers';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const UserDetailModal = ({ isOpen, onClose, user }: UserDetailModalProps) => {
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedPositionId, setSelectedPositionId] = useState('');

  const assignRoleMutation = useAssignRoleMutation();
  const assignPositionMutation = useAssignPositionMutation();

  const { data: allRoles = [] } = useQuery({
    queryKey: ['all-roles'],
    queryFn: () => RoleService.getAllRoles(),
    enabled: isOpen,
  });

  const { data: allPositions = [] } = useQuery({
    queryKey: ['all-positions'],
    queryFn: () => PositionService.getAllPositions(),
    enabled: isOpen,
  });

  if (!isOpen || !user) return null;

  const handleAssignRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId) return;
    assignRoleMutation.mutate(
      { userId: user.id, roleId: parseInt(selectedRoleId) },
      { onSuccess: () => setSelectedRoleId('') }
    );
  };

  const handleAssignPosition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPositionId) return;
    assignPositionMutation.mutate(
      { userId: user.id, positionId: parseInt(selectedPositionId) },
      { onSuccess: () => setSelectedPositionId('') }
    );
  };

  // Filter out already-assigned roles to only show unassigned ones
  const currentRoleNames = new Set(user.roles ?? []);
  const availableRoles = allRoles.filter(r => !currentRoleNames.has(r.name));

  const currentPositionNames = new Set(user.positionNames ?? []);
  const availablePositions = allPositions.filter(p => !currentPositionNames.has(p.name));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-indigo-600" />
            User Profile
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold shadow-sm flex-shrink-0">
              {(user.fullName || user.username || '').charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{user.fullName}</h3>
              <p className="text-slate-500 font-medium">@{user.username}</p>
              <div className="flex items-center gap-2 mt-1">
                {user.active ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    <XCircle className="w-3 h-3" /> Inactive
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Mail className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Email</span>
              </div>
              <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Phone className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Phone</span>
              </div>
              <p className="text-sm font-medium text-slate-900">{user.phone || 'N/A'}</p>
            </div>
          </div>

          {/* System ID */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">System ID</span>
            <p className="text-sm font-mono text-slate-700 mt-0.5">{user.id}</p>
          </div>

          {/* ── Roles section ── */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Assigned Roles</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3 min-h-[24px]">
              {(user.roles ?? []).length === 0 ? (
                <span className="text-xs text-slate-400 italic">No roles assigned</span>
              ) : (
                (user.roles ?? []).map(role => (
                  <span key={role} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {role}
                  </span>
                ))
              )}
            </div>
            {/* Assign role form */}
            <form onSubmit={handleAssignRole} className="flex gap-2 mt-2">
              <select
                value={selectedRoleId}
                onChange={e => setSelectedRoleId(e.target.value)}
                className="flex-1 text-sm rounded-md border border-slate-300 px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              >
                <option value="">Add a role...</option>
                {availableRoles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={!selectedRoleId || assignRoleMutation.isPending}
                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Assign
              </button>
            </form>
          </div>

          {/* ── Positions section ── */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 mb-3">
              <Briefcase className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Assigned Positions</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3 min-h-[24px]">
              {(user.positionNames ?? []).length === 0 ? (
                <span className="text-xs text-slate-400 italic">No positions assigned</span>
              ) : (
                (user.positionNames ?? []).map(pos => (
                  <span key={pos} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                    {pos}
                  </span>
                ))
              )}
            </div>
            {/* Assign position form */}
            <form onSubmit={handleAssignPosition} className="flex gap-2 mt-2">
              <select
                value={selectedPositionId}
                onChange={e => setSelectedPositionId(e.target.value)}
                className="flex-1 text-sm rounded-md border border-slate-300 px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              >
                <option value="">Add a position...</option>
                {availablePositions.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={!selectedPositionId || assignPositionMutation.isPending}
                className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 text-white rounded-md text-xs font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ShieldPlus className="w-3.5 h-3.5" />
                Assign
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
