import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTaskMonthlyChart } from '@/features/dashboard/hooks/useDashboard';
import { Loader2, AlertCircle, TrendingUp } from 'lucide-react';

export function TaskMonthlyLineChart() {
  const { data, isLoading, isError } = useTaskMonthlyChart();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6 h-[360px]">
        <div className="h-5 w-44 bg-surface-200 dark:bg-surface-700 rounded-lg animate-pulse mb-6" />
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
        <TrendingUp className="w-10 h-10 mb-3 opacity-40" />
        <span className="text-sm font-medium">No monthly data available</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/50 p-6 h-[360px]">
      <h3 className="text-base font-semibold text-surface-800 dark:text-surface-100 mb-2">Tasks Created by Month</h3>
      <ResponsiveContainer width="100%" height="88%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
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
          <Area
            type="monotone"
            dataKey="count"
            stroke="#10b981"
            strokeWidth={2.5}
            fill="url(#areaGradient)"
            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
