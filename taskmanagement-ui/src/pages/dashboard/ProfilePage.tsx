import { User, Mail, Phone, Shield, Building, Calendar, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">My Profile</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Manage your personal information and preferences.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm font-medium text-surface-700 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors shadow-sm">
          <Settings className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      <div className="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 overflow-hidden shadow-sm">
        {/* Cover & Avatar */}
        <div className="h-32 bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-900 dark:to-indigo-900"></div>
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="-mt-12">
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-surface-800 p-1.5 shadow-lg border border-surface-200 dark:border-surface-700">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-3xl font-bold text-white">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
            <div className="pt-2 sm:pt-4 flex-1">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">{user.fullName || user.username}</h2>
              <p className="text-surface-500 dark:text-surface-400 font-medium">@{user.username}</p>
              <div className="flex gap-2 mt-3">
                {user.roles?.map(role => (
                  <span key={role} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 border border-primary-200 dark:border-primary-800/50">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 uppercase tracking-wider mb-4">Contact Information</h3>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-surface-100 dark:bg-surface-800 rounded-lg text-surface-500 dark:text-surface-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Email Address</p>
                  <p className="text-surface-900 dark:text-surface-100 font-medium mt-0.5">{user.email || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-surface-100 dark:bg-surface-800 rounded-lg text-surface-500 dark:text-surface-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Phone Number</p>
                  <p className="text-surface-900 dark:text-surface-100 font-medium mt-0.5">{user.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 uppercase tracking-wider mb-4">Account Information</h3>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-surface-100 dark:bg-surface-800 rounded-lg text-surface-500 dark:text-surface-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Account Status</p>
                  <div className="mt-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-surface-100 dark:bg-surface-800 rounded-lg text-surface-500 dark:text-surface-400">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Department/Position</p>
                  <p className="text-surface-900 dark:text-surface-100 font-medium mt-0.5">Software Engineering</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
