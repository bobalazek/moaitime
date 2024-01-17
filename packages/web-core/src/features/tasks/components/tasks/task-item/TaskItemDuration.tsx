import { TimerIcon } from 'lucide-react';

import { getDurationText, Task as TaskType } from '@moaitime/shared-common';
import { cn } from '@moaitime/web-ui';

const TaskItemDuration = ({ task }: { task: TaskType }) => {
  if (!task.durationSeconds) {
    return null;
  }

  return (
    <div
      className={cn('flex items-center space-x-1 align-middle text-xs')}
      data-test="tasks--task--duration"
    >
      <TimerIcon size={12} />
      <span>{getDurationText(task.durationSeconds)}</span>
    </div>
  );
};

export default TaskItemDuration;
