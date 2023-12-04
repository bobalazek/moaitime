import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { TaskInterface } from '@myzenbuddy/shared-common';

import Task from './Task';

const SortableTask = ({ task }: { task: TaskInterface }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} data-test="tasks--sortable-task" {...attributes} {...listeners}>
      <Task task={task} />
    </div>
  );
};

export default SortableTask;
