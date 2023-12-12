import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Task } from '@myzenbuddy/shared-common';

import TaskComponent from './Task';

const SortableTask = ({ task }: { task: Task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
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
      <TaskComponent task={task} />
    </div>
  );
};

export default SortableTask;
