import type { ReactNode } from 'react';

interface StatisticCardProps {
  title: string;
  value?: number | string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  isLoading?: boolean;
}

export function StatisticCard({
  title,
  value,
  icon,
  iconBgColor = 'bg-slate-100',
  iconColor = 'text-slate-600',
  isLoading = false,
}: StatisticCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md">
      <div
        className={`p-4 rounded-full ${iconBgColor} ${iconColor} flex-shrink-0`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-500 truncate">{title}</p>
        {isLoading ? (
          <div className="mt-2 h-8 w-20 bg-slate-200 rounded animate-pulse" />
        ) : (
          <p className="mt-1 text-3xl font-bold text-slate-900 truncate">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}
