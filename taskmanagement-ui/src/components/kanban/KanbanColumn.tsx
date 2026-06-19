import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Task } from '../../types/task';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  status: string;
  tasks: Task[];
  title: string;
}

export function KanbanColumn({ status, tasks, title }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'Column',
      status,
    },
  });

  return (
    <div className="flex flex-col bg-slate-100/50 rounded-xl w-80 min-w-[320px] flex-shrink-0 border border-slate-200/60">
      {/* Column Header */}
      <div className="p-4 border-b border-slate-200/60 flex items-center justify-between bg-slate-50 rounded-t-xl">
        <h3 className="font-bold text-slate-700">{title}</h3>
        <span className="bg-white text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm border border-slate-200">
          {tasks.length}
        </span>
      </div>

      {/* Droppable Area */}
      <div 
        ref={setNodeRef} 
        className={`flex-1 p-3 overflow-y-auto flex flex-col gap-3 min-h-[500px] transition-colors
          ${isOver ? 'bg-indigo-50/50 ring-2 ring-indigo-500/20 inset-0' : ''}
        `}
      >
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="h-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 text-sm font-medium">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
