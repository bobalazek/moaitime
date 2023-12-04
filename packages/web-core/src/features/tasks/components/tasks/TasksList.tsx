import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useRef } from 'react';

import { TasksListSortFieldEnum } from '@myzenbuddy/shared-common';

import { useTasksStore } from '../../state/tasksStore';
import SortableTask from './SortableTask';

const modifiers = [restrictToVerticalAxis];
const collisionDetection = closestCenter;
const strategy = verticalListSortingStrategy;

export default function TasksList() {
  const { reorderTasks, selectedListTasks, selectedListTasksSortField, setListEndElement } =
    useTasksStore();
  const taskItemsListEndElementRef = useRef<HTMLDivElement>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    reorderTasks(active.id as string, over.id as string);
  };

  useEffect(() => {
    setListEndElement(taskItemsListEndElementRef.current);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative h-[320px] overflow-auto pr-4" data-test="tasks--tasks-list">
      {selectedListTasks.length === 0 && <div className="py-1 italic">No tasks. Yay!</div>}
      <DndContext
        sensors={sensors}
        modifiers={modifiers}
        collisionDetection={collisionDetection}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={selectedListTasks}
          strategy={strategy}
          disabled={selectedListTasksSortField !== TasksListSortFieldEnum.ORDER}
        >
          {selectedListTasks.map((task) => (
            <SortableTask key={task.id} task={task} />
          ))}
        </SortableContext>
      </DndContext>
      <div ref={taskItemsListEndElementRef} className="h-[1px]" />
    </div>
  );
}
