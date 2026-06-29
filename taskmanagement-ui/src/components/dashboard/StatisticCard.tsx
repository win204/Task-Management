import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface StatisticCardProps {
  title: string;
  value?: number | string;
  icon: ReactNode;
  gradient?: string;
  isLoading?: boolean;
  to?: string;
}

export function StatisticCard({
  title,
  value,
  icon,
  gradient = 'from-primary-500 to-primary-700',
  isLoading = false,
  to,
}: StatisticCardProps) {
  
  const content = (
    <div className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700/50 shadow-sm hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 ${to ? 'cursor-pointer' : ''}`}>
      {/* Gradient accent strip */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />

      <div className="p-5 flex items-center gap-4">
        {/* Icon container with gradient background */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg opacity-90 group-hover:opacity-100 transition-opacity`}>
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-1">
            {title}
          </p>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-7 w-16 bg-surface-200 dark:bg-surface-700 rounded-lg animate-pulse" />
            </div>
          ) : (
            <p className="text-2xl font-extrabold text-surface-900 dark:text-white tracking-tight">
              {value?.toLocaleString() ?? '—'}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (to) {
    return <Link to={to} className="block">{content}</Link>;
  }

  return content;
}
