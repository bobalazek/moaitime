import type { DragEndEvent } from '@dnd-kit/core';

import {
  closestCenter,
  DndContext,
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
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { TasksListSortFieldEnum } from '@myzenbuddy/shared-common';

import { useTasksStore } from '../../state/tasksStore';
import SortableTask from './SortableTask';

const modifiers = [restrictToVerticalAxis];
const collisionDetection = closestCenter;
const strategy = verticalListSortingStrategy;

export default function TasksList() {
  const { reorderTasks, selectedListTasks, selectedListTasksSortField, setListEndElement } =
    useTasksStore();
  const [allowAnimations, setAllowAnimations] = useState(true);
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

  const onDragStart = () => {
    // We need to disable the animations when dragging starts,
    // otherwise we get strange behaviour as the dropped task
    // jumps back to the original position for a split second,
    // and then animates to the new position.
    setAllowAnimations(false);
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    await reorderTasks(active.id as string, over.id as string);

    setAllowAnimations(true);
  };

  useEffect(() => {
    setListEndElement(taskItemsListEndElementRef.current);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSortableDisabled =
    selectedListTasks.length === 0 || selectedListTasksSortField !== TasksListSortFieldEnum.ORDER;

  return (
    <div className="relative h-[320px] overflow-auto pr-4" data-test="tasks--tasks-list">
      <DndContext
        sensors={sensors}
        modifiers={modifiers}
        collisionDetection={collisionDetection}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={selectedListTasks}
          strategy={strategy}
          disabled={isSortableDisabled}
        >
          <AnimatePresence>
            {selectedListTasks.length === 0 && (
              <motion.div layout={allowAnimations} className="py-1 italic">
                No tasks. Yay!
              </motion.div>
            )}
            {selectedListTasks.map((task) => (
              <motion.div key={task.id} layout={allowAnimations}>
                <SortableTask task={task} />
              </motion.div>
            ))}
          </AnimatePresence>
        </SortableContext>
      </DndContext>
      <div ref={taskItemsListEndElementRef} className="h-[1px]" />
    </div>
  );
}
