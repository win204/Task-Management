import { useDroppable } from '@dnd-kit/core';
import type { Task } from '@/features/tasks/types/task';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  status: string;
  tasks: Task[];
  title: string;
}

const STATUS_COLORS: Record<string, string> = {
  TODO: 'bg-surface-400',
  IN_PROGRESS: 'bg-blue-500',
  REVIEW: 'bg-amber-500',
  DONE: 'bg-emerald-500',
};

export function KanbanColumn({ status, tasks, title }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'Column',
      status,
    },
  });

  return (
    <div className="flex flex-col bg-surface-100/50 dark:bg-surface-800/30 rounded-2xl w-80 min-w-[320px] flex-shrink-0 border border-surface-200/60 dark:border-surface-700/40">
      {/* Column Header */}
      <div className="p-4 border-b border-surface-200/60 dark:border-surface-700/40 flex items-center justify-between bg-surface-50/80 dark:bg-surface-800/50 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[status] || 'bg-surface-400'}`} />
          <h3 className="font-bold text-surface-700 dark:text-surface-200 text-sm">{title}</h3>
        </div>
        <span className="bg-white dark:bg-surface-700 text-surface-500 dark:text-surface-400 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm border border-surface-200 dark:border-surface-600">
          {tasks.length}
        </span>
      </div>

      {/* Droppable Area */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-3 overflow-y-auto flex flex-col gap-3 min-h-[500px] transition-colors rounded-b-2xl
          ${isOver ? 'bg-primary-50/50 dark:bg-primary-500/5 ring-2 ring-primary-500/20 ring-inset' : ''}
        `}
      >
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="h-24 border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-xl flex items-center justify-center text-surface-400 dark:text-surface-500 text-sm font-medium">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
