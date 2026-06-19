import React, { useMemo } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { Task } from '../../types/task';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { useKanban } from '../../hooks/useKanban';
import { Loader2, AlertCircle } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  isLoading: boolean;
  isError: boolean;
}

const COLUMNS = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'REVIEW', title: 'In Review' },
  { id: 'DONE', title: 'Done' }
];

export function KanbanBoard({ tasks, isLoading, isError }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  const { updateTaskStatus } = useKanban();

  // Sensors for Drag and Drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires 5px movement before dragging starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group tasks by status
  const columnsData = useMemo(() => {
    const grouped = COLUMNS.reduce((acc, col) => {
      acc[col.id] = tasks.filter(task => task.status === col.id);
      return acc;
    }, {} as Record<string, Task[]>);
    return grouped;
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskData = active.data.current?.task as Task;
    if (taskData) {
      setActiveTask(taskData);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    // If dropped over a column
    const activeTaskData = active.data.current?.task as Task;
    const newStatus = over.data.current?.status as string;

    if (activeTaskData && newStatus && activeTaskData.status !== newStatus) {
      // Optimistically update via hook
      updateTaskStatus({
        taskId: activeTaskData.id,
        newStatus: newStatus
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <span className="ml-3 text-slate-600 font-medium">Loading board...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-red-500 bg-red-50 rounded-xl border border-red-100">
        <AlertCircle className="w-12 h-12 mb-4" />
        <h3 className="text-lg font-bold">Failed to load tasks</h3>
        <p className="text-sm font-medium opacity-80">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-200px)] items-start">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            status={col.id}
            title={col.title}
            tasks={columnsData[col.id] || []}
          />
        ))}

        {/* Overlay shown while dragging */}
        <DragOverlay>
          {activeTask ? (
            <div className="opacity-90 rotate-2 scale-105 shadow-xl cursor-grabbing">
              <KanbanCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
