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
import ConfettiExplosion from 'react-confetti-explosion';

import { GlobalEventsEnum, TasksListSortFieldEnum } from '@moaitime/shared-common';

import { globalEventsEmitter } from '../../../core/state/globalEventsEmitter';
import { useListsStore } from '../../state/listsStore';
import { useTasksStore } from '../../state/tasksStore';
import SortableTaskItem from '../task-item/SortableTaskItem';

const modifiers = [restrictToVerticalAxis];
const collisionDetection = closestCenter;
const strategy = verticalListSortingStrategy;

export default function TasksList() {
  const { reorderTasks, setListEndElement } = useTasksStore();
  const { selectedListTasks, selectedListTasksSortField, selectedListTasksIncludeCompleted } =
    useListsStore();
  const [allowAnimations, setAllowAnimations] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
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

  // This is a workaround so we can show the confetti when a task is completed,
  // in case we do not have the "include completed" option enabled.
  useEffect(() => {
    if (selectedListTasksIncludeCompleted) {
      return;
    }

    const taskCompletedCallback = () => {
      setShowConfetti(true);
    };

    globalEventsEmitter.on(GlobalEventsEnum.TASKS_TASK_COMPLETED, taskCompletedCallback);

    return () => {
      globalEventsEmitter.off(GlobalEventsEnum.TASKS_TASK_COMPLETED, taskCompletedCallback);
    };
  }, [selectedListTasksIncludeCompleted]);

  const isSortableDisabled =
    selectedListTasks.length === 0 || selectedListTasksSortField !== TasksListSortFieldEnum.ORDER;

  return (
    <div
      className="relative h-[320px] max-w-[320px] overflow-auto md:max-w-[380px]"
      data-test="tasks--tasks-list"
    >
      {showConfetti && (
        <ConfettiExplosion
          zIndex={9999}
          particleSize={6}
          particleCount={50}
          duration={2200}
          onComplete={() => {
            setShowConfetti(false);
          }}
        />
      )}
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
                <SortableTaskItem task={task} />
              </motion.div>
            ))}
          </AnimatePresence>
        </SortableContext>
      </DndContext>
      <div ref={taskItemsListEndElementRef} className="h-[1px]" />
    </div>
  );
}
