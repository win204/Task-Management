import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ActivityLogService, type ActivityLogSearchParams } from '../../services/ActivityLogService';
import { ReportService } from '../../services/ReportService';
import { formatVietnamTime } from '../../utils/dateUtils';
import { Activity, Search, Filter, RefreshCw, ChevronLeft, ChevronRight, FileDown, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export const ActivityLogsPage = () => {
  const [params, setParams] = useState<ActivityLogSearchParams>({
    page: 0,
    size: 20
  });

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ['activity-logs', params],
    queryFn: () => ActivityLogService.searchLogs(params),
  });

  const logs = response?.content || [];
  const pageData = response;

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value || undefined, page: 0 }));
  };

  const handlePageChange = (newPage: number) => {
    setParams(prev => ({ ...prev, page: newPage }));
  };

  const handleExportExcel = async () => {
    try {
      const { page, size, ...exportParams } = params;
      const blob = await ReportService.exportActivityLogsToExcel(exportParams);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'activity_logs.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Excel exported successfully');
    } catch (error) {
      toast.error('Failed to export to Excel');
    }
  };

  const handleExportPdf = async () => {
    try {
      const { page, size, ...exportParams } = params;
      const blob = await ReportService.exportActivityLogsToPdf(exportParams);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'activity_logs.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('PDF exported successfully');
    } catch (error) {
      toast.error('Failed to export to PDF');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">Activity Logs</h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Monitor system activities and user operations.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 text-slate-700 dark:text-surface-200 rounded-lg hover:bg-slate-50 dark:hover:bg-surface-700 transition-colors flex items-center gap-2 font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
          >
            <FileDown className="w-4 h-4" />
            Excel
          </button>
          <button
            onClick={handleExportPdf}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-surface-700 flex flex-col gap-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="username"
                placeholder="Search by username..."
                value={params.username || ''}
                onChange={handleFilterChange}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="flex-1 min-w-[150px]">
            <input
              type="text"
              name="action"
              placeholder="Search action..."
              value={params.action || ''}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <input
              type="text"
              name="ipAddress"
              placeholder="Search IP address..."
              value={params.ipAddress || ''}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                name="module"
                value={params.module || ''}
                onChange={handleFilterChange}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none"
              >
                <option value="">All Modules</option>
                <option value="PROJECT">Projects</option>
                <option value="TASK">Tasks</option>
                <option value="USER">Users</option>
                <option value="AUTH">Authentication</option>
              </select>
            </div>
          </div>

          <div className="w-48">
            <select
              name="result"
              value={params.result || ''}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none"
            >
              <option value="">All Results</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          <div className="w-48">
            <input
              type="date"
              name="startDate"
              value={params.startDate?.split('T')[0] || ''}
              onChange={(e) => setParams(prev => ({ ...prev, startDate: e.target.value ? `${e.target.value}T00:00:00+07:00` : undefined, page: 0 }))}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-slate-600 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div className="w-48">
            <input
              type="date"
              name="endDate"
              value={params.endDate?.split('T')[0] || ''}
              onChange={(e) => setParams(prev => ({ ...prev, endDate: e.target.value ? `${e.target.value}T23:59:59+07:00` : undefined, page: 0 }))}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-slate-600 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-slate-200 dark:border-surface-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-surface-900/50 border-b border-slate-200 dark:border-surface-700">
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    IP & Result
                  </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-surface-700/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-surface-400">
                    Loading activity logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-surface-400">
                    No activities found matching the criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-surface-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500 dark:text-surface-400">
                      {formatVietnamTime(log.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-700 dark:text-surface-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900 dark:text-surface-100 bg-slate-100 dark:bg-surface-700 px-2 py-1 rounded">
                        @{log.username || 'system'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-sm text-surface-900 dark:text-surface-100">
                        <span className="font-medium text-surface-900 dark:text-surface-50">{log.description}</span>
                        {log.taskTitle && (
                          <span className="text-surface-500 dark:text-surface-400">Task: {log.taskTitle}</span>
                        )}
                        {log.module && (
                          <span className="text-surface-400 dark:text-surface-500 text-xs">Module: {log.module} (ID: {log.entityId})</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="text-surface-500 dark:text-surface-400 font-mono text-xs">{log.ipAddress || 'SYSTEM'}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium w-fit ${
                          log.result === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {log.result || 'SUCCESS'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pageData && pageData.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-surface-700 bg-slate-50 dark:bg-surface-900/50 flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-surface-400">
              Showing <span className="font-medium text-slate-700 dark:text-surface-200">{pageData.number * pageData.size + 1}</span> to{' '}
              <span className="font-medium text-slate-700 dark:text-surface-200">
                {Math.min((pageData.number + 1) * pageData.size, pageData.totalElements)}
              </span>{' '}
              of <span className="font-medium text-slate-700 dark:text-surface-200">{pageData.totalElements}</span> results
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pageData.number - 1)}
                disabled={pageData.first}
                className="p-2 border border-slate-300 dark:border-surface-600 rounded-md bg-white dark:bg-surface-800 text-slate-600 dark:text-surface-300 hover:bg-slate-50 dark:hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(pageData.number + 1)}
                disabled={pageData.last}
                className="p-2 border border-slate-300 dark:border-surface-600 rounded-md bg-white dark:bg-surface-800 text-slate-600 dark:text-surface-300 hover:bg-slate-50 dark:hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
