import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { storage } from '../../utils/storage';
import { ShieldAlert, User as UserIcon, Calendar, CheckSquare, RefreshCw, Key } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../api/axios';

/**
 * DashboardPage component verifying active authentication states
 * and providing tools to test token refreshes and authenticated API requests.
 */
export default function DashboardPage() {
  const { user, accessToken, refreshToken, updateSession } = useAuthStore();

  useEffect(() => {
    console.log('[DashboardPage] Mount event captured. Session parameters:', {
      hasUser: !!user,
      username: user?.username,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken
    });
  }, [user, accessToken, refreshToken]);

  const handleTestSecureRequest = async () => {
    console.log('[DashboardPage] Triggering manual secure API request to /api/users...');
    try {
      const res = await apiClient.get('/api/users');
      console.log('[DashboardPage] Secure request resolved success. Response:', res.data);
      toast.success(`Secure request succeeded! Loaded ${res.data.data.length} users.`);
    } catch (err: unknown) {
      console.error('[DashboardPage] Secure API request failed:', err);
      const errorResponse = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(errorResponse.response?.data?.message || 'Secure request failed');
    }
  };

  const handleForceTokenRefresh = async () => {
    console.log('[DashboardPage] Triggering manual token rotation...');
    try {
      const activeRefreshToken = storage.getRefreshToken();
      if (!activeRefreshToken) {
        console.error('[DashboardPage] Rotation cancelled: refresh token not found in localStorage');
        toast.error('No refresh token in localStorage');
        return;
      }
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const axios = await import('axios');
      
      toast.loading('Rotating tokens...', { id: 'rtr-refresh' });
      console.log('[DashboardPage] Sending rotation request to API...');
      const response = await axios.default.post(`${API_BASE_URL}/api/auth/refresh`, {
        refreshToken: activeRefreshToken,
      });

      console.log('[DashboardPage] Rotation response returned:', response.data);
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
      
      storage.setAccessToken(newAccessToken);
      storage.setRefreshToken(newRefreshToken);
      
      updateSession(newAccessToken, newRefreshToken);
      toast.success('Tokens rotated successfully!', { id: 'rtr-refresh' });
    } catch (err: unknown) {
      console.error('[DashboardPage] Manual token rotation failed:', err);
      toast.error('Token rotation failed. Session may be expired.', { id: 'rtr-refresh' });
    }
  };

  const stats = [
    { name: 'Pending Tasks', count: '12', color: 'bg-amber-500' },
    { name: 'In Progress', count: '4', color: 'bg-blue-500' },
    { name: 'Completed Tasks', count: '28', color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome banner */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-indigo-55 rounded-2xl flex items-center justify-center text-indigo-600">
            <UserIcon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.fullName}!</h1>
            <p className="text-sm text-slate-500 mt-1">
              You are signed in as <span className="font-semibold text-slate-700">{user?.username}</span> with role:{' '}
              <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                {user?.roles?.[0] || 'User'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <Calendar className="h-5 w-5 text-slate-400" />
          <span className="text-sm text-slate-500 font-medium">
            System Date: {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Grid: Stats & Session Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side Column - Dashboard Stats */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-indigo-600" />
            Workspace Statistics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <p className="text-sm text-slate-400 font-medium">{stat.name}</p>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-3xl font-bold text-slate-800">{stat.count}</span>
                  <div className={`h-2.5 w-2.5 rounded-full ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Test Operations panel */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800">Token Interceptor Tests</h4>
            <p className="text-sm text-slate-500">
              Verify the integration of global state configurations and custom Axios interceptors.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={handleTestSecureRequest}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <ShieldAlert className="h-4 w-4" />
                Test Secure API Call
              </button>

              <button
                onClick={handleForceTokenRefresh}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                Force Token Rotation
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Column - Session Inspect Panel */}
        <div className="bg-slate-900 rounded-2xl p-6 text-slate-300 font-mono text-xs flex flex-col gap-4 shadow-xl border border-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Key className="h-4 w-4 text-indigo-400" />
            <h4 className="font-bold text-slate-100 uppercase tracking-wider">Active Session Details</h4>
          </div>

          <div className="space-y-4 flex-1 overflow-x-auto min-w-0">
            <div>
              <p className="text-indigo-400 font-bold mb-1">ACCESS TOKEN (JWT):</p>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 break-all max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
                {accessToken}
              </div>
            </div>

            <div>
              <p className="text-indigo-400 font-bold mb-1">REFRESH TOKEN:</p>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 break-all max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
                {refreshToken}
              </div>
            </div>

            <div>
              <p className="text-indigo-400 font-bold mb-1">USER PARSED PAYLOAD:</p>
              <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
