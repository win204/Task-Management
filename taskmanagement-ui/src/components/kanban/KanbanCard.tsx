import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Task } from '../../types/task';
import { TaskPriorityBadge } from '../tasks/TaskPriorityBadge';
import { Calendar, UserCircle2 } from 'lucide-react';
import { format } from 'date-fns';

interface KanbanCardProps {
  task: Task;
}

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
        bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing
        hover:shadow-md transition-all
        ${isDragging ? 'opacity-50 ring-2 ring-indigo-500 scale-105 z-50' : 'opacity-100'}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-slate-800 line-clamp-2 leading-tight">
          {task.title}
        </h4>
      </div>
      
      {task.projectName && (
        <p className="text-xs font-medium text-slate-500 mb-3 bg-slate-100 w-fit px-2 py-0.5 rounded-full">
          {task.projectName}
        </p>
      )}

      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center justify-between">
          <TaskPriorityBadge priority={task.priority} />
          {task.dueDate && (
            <div className="flex items-center text-xs text-slate-500">
              <Calendar className="w-3 h-3 mr-1" />
              {format(new Date(task.dueDate), 'MMM d')}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-1">
          <div className="flex items-center text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-md">
            <UserCircle2 className="w-4 h-4 mr-1 text-slate-400" />
            <span className="truncate max-w-[100px]">{task.assigneeName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
