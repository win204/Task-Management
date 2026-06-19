import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { ReportService } from '../../services/ReportService';

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Analytics & Reports</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Task Excel Export */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <FileSpreadsheet className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">Tasks Report</h3>
          <p className="text-sm text-slate-500 mb-4">Export all tasks data into an Excel spreadsheet.</p>
          <button
            onClick={() => handleDownload(ReportService.exportTasksToExcel, setExportingTasksExcel, 'tasks_report.xlsx')}
            disabled={exportingTasksExcel}
            className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {exportingTasksExcel ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {exportingTasksExcel ? 'Exporting...' : 'Export Excel'}
          </button>
        </div>

        {/* Projects Excel Export */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <FileSpreadsheet className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">Projects Report</h3>
          <p className="text-sm text-slate-500 mb-4">Export all projects data into an Excel spreadsheet.</p>
          <button
            onClick={() => handleDownload(ReportService.exportProjectsToExcel, setExportingProjectsExcel, 'projects_report.xlsx')}
            disabled={exportingProjectsExcel}
            className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {exportingProjectsExcel ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {exportingProjectsExcel ? 'Exporting...' : 'Export Excel'}
          </button>
        </div>

        {/* Users Excel Export */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <FileSpreadsheet className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">Users Report</h3>
          <p className="text-sm text-slate-500 mb-4">Export user directory and status into an Excel spreadsheet.</p>
          <button
            onClick={() => handleDownload(ReportService.exportUsersToExcel, setExportingUsersExcel, 'users_report.xlsx')}
            disabled={exportingUsersExcel}
            className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {exportingUsersExcel ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {exportingUsersExcel ? 'Exporting...' : 'Export Excel'}
          </button>
        </div>

        {/* Task PDF Export */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">Tasks PDF</h3>
          <p className="text-sm text-slate-500 mb-4">Export a formatted PDF report of all system tasks.</p>
          <button
            onClick={() => handleDownload(ReportService.exportTasksToPdf, setExportingTasksPdf, 'tasks_report.pdf')}
            disabled={exportingTasksPdf}
            className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {exportingTasksPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {exportingTasksPdf ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-80 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Task Completion Rate</h2>
          <div className="flex-1 border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center text-slate-400">
            Chart Component
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-80 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Workload Distribution</h2>
          <div className="flex-1 border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center text-slate-400">
            Chart Component
          </div>
        </div>
      </div>
    </div>
  );
}
