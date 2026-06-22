import { useDraggable } from '@dnd-kit/core';
import type { Task } from '../../types/task';
import { TaskPriorityBadge } from '../tasks/TaskPriorityBadge';
import { Calendar, UserCircle2 } from 'lucide-react';
import { format } from 'date-fns';

interface KanbanCardProps {
  task: Task;
}

const PRIORITY_STRIPE: Record<string, string> = {
  HIGH: 'bg-red-500',
  MEDIUM: 'bg-amber-500',
  LOW: 'bg-emerald-500',
  CRITICAL: 'bg-red-700',
};

export function KanbanCard({ task }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id.toString(),
    data: {
      type: 'Task',
      task,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        relative overflow-hidden bg-white dark:bg-surface-800 p-4 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700/50 cursor-grab active:cursor-grabbing
        hover:shadow-md dark:hover:shadow-lg transition-all
        ${isDragging ? 'opacity-50 ring-2 ring-primary-500 scale-105 z-50' : 'opacity-100'}
      `}
    >
      {/* Priority color strip on left edge */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${PRIORITY_STRIPE[task.priority] || 'bg-surface-300 dark:bg-surface-600'}`} />

      <div className="pl-2">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-surface-800 dark:text-surface-100 line-clamp-2 leading-tight text-sm">
            {task.title}
          </h4>
        </div>

        {task.projectName && (
          <p className="text-[11px] font-medium text-surface-500 dark:text-surface-400 mb-3 bg-surface-100 dark:bg-surface-700/50 w-fit px-2 py-0.5 rounded-full">
            {task.projectName}
          </p>
        )}

        <div className="flex flex-col gap-2 mt-3">
          <div className="flex items-center justify-between">
            <TaskPriorityBadge priority={task.priority} />
            {task.dueDate && (
              <div className="flex items-center text-xs text-surface-500 dark:text-surface-400">
                <Calendar className="w-3 h-3 mr-1" />
                {format(new Date(task.dueDate), 'MMM d')}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-surface-100 dark:border-surface-700/50 pt-2 mt-1">
            <div className="flex items-center text-xs text-surface-600 dark:text-surface-300 bg-surface-50 dark:bg-surface-700/30 px-2 py-1 rounded-lg">
              <UserCircle2 className="w-4 h-4 mr-1 text-surface-400 dark:text-surface-500" />
              <span className="truncate max-w-[100px]">{task.assigneeName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
