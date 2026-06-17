import { X, User as UserIcon, Mail, Phone, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import type { User } from '../../types/user';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const UserDetailModal = ({ isOpen, onClose, user }: UserDetailModalProps) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-indigo-600" />
            User Profile
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold shadow-sm">
              {user.fullName.charAt(0).toUpperCase()}
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

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Assigned Roles</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.roles?.map(role => (
                  <span key={role} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {role}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <span className="text-xs font-medium uppercase tracking-wider">System ID</span>
              </div>
              <p className="text-sm font-mono text-slate-700">{user.id}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
