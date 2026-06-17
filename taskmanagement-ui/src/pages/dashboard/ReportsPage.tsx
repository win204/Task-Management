export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Analytics & Reports</h1>
        <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors">
          Export Data
        </button>
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
