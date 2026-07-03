import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTaskStatusChart } from '@/features/dashboard/hooks/useDashboard';
import { Loader2, AlertCircle, PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

export function TaskStatusPieChart() {
  const { data, isLoading, isError } = useTaskStatusChart();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6 h-[360px]">
        <div className="h-5 w-32 bg-surface-200 dark:bg-surface-700 rounded-lg animate-pulse mb-6" />
        <div className="flex items-center justify-center h-[calc(100%-44px)]">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6 h-[360px] flex flex-col items-center justify-center text-red-500 dark:text-red-400">
        <AlertCircle className="w-8 h-8 mb-2" />
        <span className="text-sm font-medium">Failed to load chart data</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6 h-[360px] flex flex-col items-center justify-center text-surface-400 dark:text-surface-500">
        <PieChartIcon className="w-10 h-10 mb-3 opacity-40" />
        <span className="text-sm font-medium">No task data available</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6 h-[360px]">
      <h3 className="text-base font-semibold text-surface-800 dark:text-surface-100 mb-2">Tasks by Status</h3>
      <ResponsiveContainer width="100%" height="88%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            strokeWidth={0}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
              background: 'white',
              padding: '10px 14px',
              fontSize: '13px',
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
