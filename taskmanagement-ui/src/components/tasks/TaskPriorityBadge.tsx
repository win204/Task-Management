import { ArrowDown, ArrowRight, ArrowUp, AlertOctagon } from 'lucide-react';

interface TaskPriorityBadgeProps {
  priority: string;
}

export const TaskPriorityBadge = ({ priority }: TaskPriorityBadgeProps) => {
  const normalizedPriority = priority.toUpperCase();
  
  switch (normalizedPriority) {
    case 'LOW':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
          <ArrowDown className="w-4 h-4 text-slate-400" />
          Low
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
          <ArrowRight className="w-4 h-4 text-blue-500" />
          Medium
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
          <ArrowUp className="w-4 h-4 text-amber-500" />
          High
        </span>
      );
    case 'URGENT':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
          <AlertOctagon className="w-4 h-4 text-red-500" />
          Urgent
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center text-xs font-medium text-slate-700">
          {priority}
        </span>
      );
  }
};
