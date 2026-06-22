import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { ReportService } from '../../services/ReportService';
import { TaskStatusPieChart } from '../../components/dashboard/TaskStatusPieChart';
import { TaskPriorityBarChart } from '../../components/dashboard/TaskPriorityBarChart';

export default function ReportsPage() {
  const [exportingTasksExcel, setExportingTasksExcel] = useState(false);
  const [exportingProjectsExcel, setExportingProjectsExcel] = useState(false);
  const [exportingUsersExcel, setExportingUsersExcel] = useState(false);
  const [exportingTasksPdf, setExportingTasksPdf] = useState(false);

  const handleDownload = async (
    exportFn: () => Promise<Blob>,
    setLoading: (val: boolean) => void,
    filename: string
  ) => {
    try {
      setLoading(true);
      const blob = await exportFn();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reportCards = [
    {
      title: 'Tasks Report',
      description: 'Export all tasks data into an Excel spreadsheet.',
      icon: FileSpreadsheet,
      iconBg: 'from-emerald-500 to-emerald-700',
      action: () => handleDownload(ReportService.exportTasksToExcel, setExportingTasksExcel, 'tasks_report.xlsx'),
      loading: exportingTasksExcel,
      buttonLabel: 'Export Excel',
    },
    {
      title: 'Projects Report',
      description: 'Export all projects data into an Excel spreadsheet.',
      icon: FileSpreadsheet,
      iconBg: 'from-blue-500 to-blue-700',
      action: () => handleDownload(ReportService.exportProjectsToExcel, setExportingProjectsExcel, 'projects_report.xlsx'),
      loading: exportingProjectsExcel,
      buttonLabel: 'Export Excel',
    },
    {
      title: 'Users Report',
      description: 'Export user directory and status into an Excel spreadsheet.',
      icon: FileSpreadsheet,
      iconBg: 'from-violet-500 to-violet-700',
      action: () => handleDownload(ReportService.exportUsersToExcel, setExportingUsersExcel, 'users_report.xlsx'),
      loading: exportingUsersExcel,
      buttonLabel: 'Export Excel',
    },
    {
      title: 'Tasks PDF',
      description: 'Export a formatted PDF report of all system tasks.',
      icon: FileText,
      iconBg: 'from-red-500 to-red-700',
      action: () => handleDownload(ReportService.exportTasksToPdf, setExportingTasksPdf, 'tasks_report.pdf'),
      loading: exportingTasksPdf,
      buttonLabel: 'Export PDF',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">Analytics & Reports</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Export data and view analytics summaries.</p>
      </div>

      {/* Export Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportCards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-surface-800/50 p-5 rounded-2xl border border-surface-200 dark:border-surface-700/50 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${card.iconBg} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-surface-800 dark:text-surface-100 mb-1">{card.title}</h3>
            <p className="text-xs text-surface-500 dark:text-surface-400 mb-4 leading-relaxed">{card.description}</p>
            <button
              onClick={card.action}
              disabled={card.loading}
              className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-surface-50 dark:bg-surface-700/50 hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-200 border border-surface-200 dark:border-surface-600 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
            >
              {card.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {card.loading ? 'Exporting...' : card.buttonLabel}
            </button>
          </div>
        ))}
      </div>

      {/* Chart Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskStatusPieChart />
        <TaskPriorityBarChart />
      </div>
    </div>
  );
}
