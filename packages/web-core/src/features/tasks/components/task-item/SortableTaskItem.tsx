import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

import { Task } from '@moaitime/shared-common';

import TaskItem from './TaskItem';

const SortableTaskItem = ({ task }: { task: Task }) => {
  const [canDrag, setCanDrag] = useState(true);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
    disabled: !canDrag,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-test="tasks--sortable-task"
      {...attributes}
      {...listeners}
    >
      <TaskItem task={task} setCanDrag={setCanDrag} />
    </div>
  );
};

export default SortableTaskItem;
