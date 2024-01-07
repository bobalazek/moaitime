import { FlagIcon } from 'lucide-react';

import { prioritiesColorMap, Task as TaskType } from '@moaitime/shared-common';

const TaskItemPriority = ({ task }: { task: TaskType }) => {
  if (!task.priority) {
    return null;
  }

  return (
    <div
      className="flex items-center space-x-1 align-middle text-xs font-bold"
      data-test="tasks--task--priority-text"
      style={{
        color: prioritiesColorMap.get(task.priority) ?? '',
      }}
    >
      <FlagIcon size={12} />
      <span>P{task.priority}</span>
    </div>
  );
};

export default TaskItemPriority;
