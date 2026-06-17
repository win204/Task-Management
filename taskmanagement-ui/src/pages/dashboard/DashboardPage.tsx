import { 
  Users, 
  FolderKanban, 
  ListTodo, 
  CheckCircle2, 
  CircleDashed, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { StatisticCard } from '../../components/dashboard/StatisticCard';
import { TaskStatusPieChart } from '../../components/dashboard/TaskStatusPieChart';
import { TaskPriorityBarChart } from '../../components/dashboard/TaskPriorityBarChart';
import { TaskMonthlyLineChart } from '../../components/dashboard/TaskMonthlyLineChart';

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboard();

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-red-200 shadow-sm">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900">Failed to load dashboard</h3>
        <p className="text-slate-500 mt-2">{error?.message || 'An unexpected error occurred'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Statistics</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatisticCard
          title="Total Users"
          value={data?.totalUsers}
          icon={<Users className="w-6 h-6" />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
          isLoading={isLoading}
        />
        
        <StatisticCard
          title="Total Projects"
          value={data?.totalProjects}
          icon={<FolderKanban className="w-6 h-6" />}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
          isLoading={isLoading}
        />

        <StatisticCard
          title="Total Tasks"
          value={data?.totalTasks}
          icon={<ListTodo className="w-6 h-6" />}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
          isLoading={isLoading}
        />

        <StatisticCard
          title="Completed Tasks"
          value={data?.completedTasks}
          icon={<CheckCircle2 className="w-6 h-6" />}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
          isLoading={isLoading}
        />

        <StatisticCard
          title="In Progress Tasks"
          value={data?.inProgressTasks}
          icon={<Loader2 className="w-6 h-6" />}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
          isLoading={isLoading}
        />

        <StatisticCard
          title="Todo Tasks"
          value={data?.todoTasks}
          icon={<CircleDashed className="w-6 h-6" />}
          iconBgColor="bg-slate-100"
          iconColor="text-slate-600"
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskStatusPieChart />
        <TaskPriorityBarChart />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <TaskMonthlyLineChart />
      </div>
    </div>
  );
}
