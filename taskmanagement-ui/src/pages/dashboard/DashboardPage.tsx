import {
  Users,
  FolderKanban,
  ListTodo,
  CheckCircle2,
  CircleDashed,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { StatisticCard } from '../../components/dashboard/StatisticCard';
import { TaskStatusPieChart } from '../../components/dashboard/TaskStatusPieChart';
import { TaskPriorityBarChart } from '../../components/dashboard/TaskPriorityBarChart';
import { TaskMonthlyLineChart } from '../../components/dashboard/TaskMonthlyLineChart';
import { useAuthStore } from '../../store/authStore';

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboard();
  const { user } = useAuthStore();

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-surface-800/50 rounded-2xl border border-red-200 dark:border-red-900/50 shadow-sm">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Failed to load dashboard</h3>
        <p className="text-surface-500 dark:text-surface-400 mt-2">{error?.message || 'An unexpected error occurred'}</p>
      </div>
    );
  }

  // Generate greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">
          {greeting}, {user?.fullName?.split(' ')[0] || user?.username || 'there'} 👋
        </h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
          Here's what's happening across your workspace today.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatisticCard
          title="Total Users"
          value={data?.totalUsers}
          icon={<Users className="w-5 h-5" />}
          gradient="from-blue-500 to-blue-700"
          isLoading={isLoading}
        />

        <StatisticCard
          title="Total Projects"
          value={data?.totalProjects}
          icon={<FolderKanban className="w-5 h-5" />}
          gradient="from-indigo-500 to-indigo-700"
          isLoading={isLoading}
        />

        <StatisticCard
          title="Total Tasks"
          value={data?.totalTasks}
          icon={<ListTodo className="w-5 h-5" />}
          gradient="from-violet-500 to-violet-700"
          isLoading={isLoading}
        />

        <StatisticCard
          title="Completed"
          value={data?.completedTasks}
          icon={<CheckCircle2 className="w-5 h-5" />}
          gradient="from-emerald-500 to-emerald-700"
          isLoading={isLoading}
        />

        <StatisticCard
          title="In Progress"
          value={data?.inProgressTasks}
          icon={<Clock className="w-5 h-5" />}
          gradient="from-amber-500 to-amber-700"
          isLoading={isLoading}
        />

        <StatisticCard
          title="To Do"
          value={data?.todoTasks}
          icon={<CircleDashed className="w-5 h-5" />}
          gradient="from-surface-500 to-surface-700"
          isLoading={isLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskStatusPieChart />
        <TaskPriorityBarChart />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <TaskMonthlyLineChart />
      </div>
    </div>
  );
}
