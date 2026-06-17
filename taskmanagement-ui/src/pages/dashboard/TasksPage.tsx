export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="flex-1 sm:w-64 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap">
            New Task
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        {/* Kanban Board Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 h-full min-h-[500px]">
          <div className="border-r border-slate-200 p-4 bg-slate-50/50">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center justify-between">
              To Do <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">5</span>
            </h3>
            <div className="space-y-3">
               <div className="bg-white p-3 rounded shadow-sm border border-slate-200 h-24 flex items-center justify-center text-slate-400 text-sm">Task Card</div>
            </div>
          </div>
          <div className="border-r border-slate-200 p-4 bg-slate-50/50">
            <h3 className="font-semibold text-indigo-700 mb-4 flex items-center justify-between">
              In Progress <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">2</span>
            </h3>
          </div>
          <div className="p-4 bg-slate-50/50">
            <h3 className="font-semibold text-emerald-700 mb-4 flex items-center justify-between">
              Done <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs">12</span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
