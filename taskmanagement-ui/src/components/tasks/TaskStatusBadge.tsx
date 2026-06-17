import { CheckCircle2, Circle, PlayCircle, AlertCircle } from 'lucide-react';

interface TaskStatusBadgeProps {
  status: string;
}

export const TaskStatusBadge = ({ status }: TaskStatusBadgeProps) => {
  const normalizedStatus = status.toUpperCase();
  
  switch (normalizedStatus) {
    case 'TODO':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
          <Circle className="w-3.5 h-3.5 text-slate-400" />
          To Do
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
          <PlayCircle className="w-3.5 h-3.5 text-blue-500" />
          In Progress
        </span>
      );
    case 'REVIEW':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          In Review
        </span>
      );
    case 'DONE':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          Done
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200 shadow-sm">
          {status.replace('_', ' ')}
        </span>
      );
  }
};
