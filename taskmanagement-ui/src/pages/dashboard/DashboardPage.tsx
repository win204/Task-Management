export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder Stat Cards */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Active Projects</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Pending Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900">48</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Completed This Week</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">24</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 min-h-[400px]">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h2>
        <div className="flex items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-100 rounded-lg">
          Activity Feed Component goes here
        </div>
      </div>
    </div>
  );
}
