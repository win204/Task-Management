import { useState } from 'react';
import { Save, Bell, Lock, Shield, Eye, Smartphone, X, Loader2, KeyRound, AlertCircle, Settings2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { UserService } from '@/features/users/api/UserService';
import { SystemConfigService, type SystemConfigResponse } from '@/features/settings/api/SystemConfigService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { resolved, toggleTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState<'appearance' | 'security' | 'system'>('appearance');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { data: configs, isLoading: configsLoading } = useQuery({
    queryKey: ['system-configs'],
    queryFn: () => SystemConfigService.getAllConfigs(),
    enabled: (user?.roles || []).includes('ADMIN') && activeTab === 'system',
  });

  const updateConfigMutation = useMutation({
    mutationFn: ({ key, value }: { key: string, value: string }) => SystemConfigService.updateConfig(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-configs'] });
      toast.success('Configuration updated successfully');
    },
    onError: () => {
      toast.error('Failed to update configuration');
    }
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
  });

  if (!user) return null;

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const openChangePassword = () => {
    reset();
    setApiError(null);
    setIsChangePasswordOpen(true);
  };

  const onChangePassword = async (data: ChangePasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      setApiError('New passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    setApiError(null);
    try {
      await UserService.changePassword(user.id, {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success('Password changed successfully!');
      setIsChangePasswordOpen(false);
      reset();
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string } }; message?: string };
      const message =
        errorResponse.response?.data?.message ||
        errorResponse.message ||
        'Failed to change password. Please check your current password.';
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfigChange = (key: string, value: string) => {
    updateConfigMutation.mutate({ key, value });
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
          <button 
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'appearance' 
                ? 'bg-surface-100 text-surface-900 dark:bg-surface-800 dark:text-surface-100' 
                : 'text-surface-600 hover:bg-surface-50 dark:text-surface-400 dark:hover:bg-surface-800/50'
            }`}
          >
            <Eye className="w-4 h-4" /> Appearance
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'security' 
                ? 'bg-surface-100 text-surface-900 dark:bg-surface-800 dark:text-surface-100' 
                : 'text-surface-600 hover:bg-surface-50 dark:text-surface-400 dark:hover:bg-surface-800/50'
            }`}
          >
            <Lock className="w-4 h-4" /> Security
          </button>
          {(user?.roles || []).includes('ADMIN') && (
            <button 
              onClick={() => setActiveTab('system')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'system' 
                  ? 'bg-surface-100 text-surface-900 dark:bg-surface-800 dark:text-surface-100' 
                  : 'text-surface-600 hover:bg-surface-50 dark:text-surface-400 dark:hover:bg-surface-800/50'
              }`}
            >
              <Settings2 className="w-4 h-4" /> System Config
            </button>
          )}
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          {/* Appearance Section */}
          {activeTab === 'appearance' && (
            <div className="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6 shadow-sm animate-in fade-in duration-200">
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
          )}

          {/* Security Section */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6 shadow-sm animate-in fade-in duration-200">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-500" /> Security
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-surface-200 dark:border-surface-700">
                  <div>
                    <p className="font-medium text-surface-900 dark:text-surface-100">Password</p>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Update your account password.</p>
                  </div>
                  <button
                    id="settings-change-password-btn"
                    onClick={openChangePassword}
                    className="px-4 py-2 text-sm font-medium text-surface-700 dark:text-surface-200 bg-surface-100 dark:bg-surface-800 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                  >
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
          )}

          {/* System Config Section */}
          {activeTab === 'system' && (user?.roles || []).includes('ADMIN') && (
            <div className="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6 shadow-sm animate-in fade-in duration-200">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-indigo-500" /> System Configuration
              </h3>
              
              {configsLoading ? (
                <div className="py-8 flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                </div>
              ) : !configs || configs.length === 0 ? (
                <div className="py-8 text-center text-surface-500">No configuration found.</div>
              ) : (
                <div className="space-y-4">
                  {configs.map((config) => (
                    <div key={config.configKey} className="p-4 rounded-xl border border-surface-200 dark:border-surface-700">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium text-surface-900 dark:text-surface-100">{config.configKey}</p>
                          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{config.description}</p>
                          <p className="text-xs text-surface-400 mt-2">Last updated by {config.updatedBy}</p>
                        </div>
                        <div className="w-full sm:w-auto">
                          {config.configValue === 'true' || config.configValue === 'false' ? (
                            <select
                              value={config.configValue}
                              onChange={(e) => handleConfigChange(config.configKey, e.target.value)}
                              className="w-full sm:w-32 px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg text-sm bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
                          ) : (
                            <input
                              type="text"
                              defaultValue={config.configValue}
                              onBlur={(e) => {
                                if (e.target.value !== config.configValue) {
                                  handleConfigChange(config.configKey, e.target.value);
                                }
                              }}
                              className="w-full sm:w-64 px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg text-sm bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl w-full max-w-md border border-surface-200 dark:border-surface-700">
            <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-primary-500" /> Change Password
              </h2>
              <button
                onClick={() => setIsChangePasswordOpen(false)}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 dark:hover:text-surface-200 dark:hover:bg-surface-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {apiError && (
              <div className="mx-5 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-2 text-red-700 dark:text-red-400">
                <AlertCircle className="w-4 h-4 flex-none mt-0.5" />
                <p className="text-sm">{apiError}</p>
              </div>
            )}

            <form id="change-password-form" onSubmit={handleSubmit(onChangePassword)} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                  Current Password
                </label>
                <input
                  id="settings-old-password"
                  type="password"
                  placeholder="••••••••"
                  {...register('oldPassword', { required: 'Current password is required' })}
                  className="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.oldPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.oldPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                  New Password
                </label>
                <input
                  id="settings-new-password"
                  type="password"
                  placeholder="••••••••"
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  className="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.newPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  id="settings-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword', {
                    required: 'Please confirm your new password',
                    validate: (val) => val === watch('newPassword') || 'Passwords do not match',
                  })}
                  className="w-full px-3 py-2.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-surface-700 dark:text-surface-300 bg-surface-100 dark:bg-surface-700 rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 rounded-xl transition-colors"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
