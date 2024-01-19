import { Trash2Icon } from 'lucide-react';

import { Task as TaskType } from '@moaitime/shared-common';

const TaskItemDeletedAt = ({ task }: { task: TaskType }) => {
  if (!task.deletedAt) {
    return null;
  }

  const deletedAtString = task.deletedAt ? new Date(task.deletedAt).toLocaleString() : '';

  return (
    <div
      className="flex items-center space-x-1 align-middle text-xs text-gray-400"
      data-test="tasks--task--deleted-text"
      title={`Deleted ${deletedAtString}`}
    >
      <Trash2Icon size={12} />
      <span>{deletedAtString}</span>
    </div>
  );
};

export default TaskItemDeletedAt;
