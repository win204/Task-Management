import { Save, Bell, Lock, Shield, Eye, Smartphone } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { resolved, toggleTheme } = useThemeStore();

  if (!user) return null;

  const handleSave = () => {
    // Theme preference is persisted in localStorage by themeStore automatically.
    // This button provides explicit user confirmation feedback.
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Settings</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Manage your account settings and preferences.</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-surface-100 text-surface-900 dark:bg-surface-800 dark:text-surface-100 transition-colors">
            <Eye className="w-4 h-4" /> Appearance
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-surface-600 hover:bg-surface-50 dark:text-surface-400 dark:hover:bg-surface-800/50 transition-colors">
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-surface-600 hover:bg-surface-50 dark:text-surface-400 dark:hover:bg-surface-800/50 transition-colors">
            <Lock className="w-4 h-4" /> Security
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-surface-600 hover:bg-surface-50 dark:text-surface-400 dark:hover:bg-surface-800/50 transition-colors">
            <Smartphone className="w-4 h-4" /> Devices
          </button>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          {/* Appearance Section */}
          <div className="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-surface-200 dark:border-surface-700">
                <div>
                  <p className="font-medium text-surface-900 dark:text-surface-100">Theme Preference</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Switch between light and dark mode.</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${resolved === 'dark' ? 'bg-primary-500' : 'bg-surface-200 dark:bg-surface-600'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${resolved === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-500" /> Security
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-surface-200 dark:border-surface-700">
                <div>
                  <p className="font-medium text-surface-900 dark:text-surface-100">Password</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Last changed 3 months ago</p>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-surface-700 dark:text-surface-200 bg-surface-100 dark:bg-surface-800 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors">
                  Change Password
                </button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-surface-200 dark:border-surface-700">
                <div>
                  <p className="font-medium text-surface-900 dark:text-surface-100">Two-Factor Authentication</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Add an extra layer of security to your account.</p>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors">
                  Enable
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
