import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTaskStatusChart } from '../../hooks/useDashboard';
import { Loader2, AlertCircle } from 'lucide-react';

const COLORS = ['#6366f1', '#eab308', '#10b981', '#f43f5e', '#8b5cf6'];

export function TaskStatusPieChart() {
  const { data, isLoading, isError } = useTaskStatusChart();

  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="h-80 flex flex-col items-center justify-center bg-red-50 rounded-xl border border-red-100 text-red-500">
        <AlertCircle className="w-8 h-8 mb-2" />
        <span className="text-sm font-medium">Failed to load chart data</span>
      </div>
    );
  }

  return (
    <div className="h-80 w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Tasks by Status</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
