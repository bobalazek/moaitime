import { formatRelative } from 'date-fns';
import { format } from 'date-fns-tz';
import { CalendarIcon } from 'lucide-react';

import { DayOfWeek, getDueDateStringForTask, Task as TaskType } from '@moaitime/shared-common';
import { cn } from '@moaitime/web-ui';

const TaskItemDueDate = ({
  task,
  timezone,
  startDayOfWeek,
}: {
  task: TaskType;
  timezone: string;
  startDayOfWeek: DayOfWeek;
}) => {
  const dateString = getDueDateStringForTask(task, timezone);
  if (!dateString) {
    return null;
  }

  const now = new Date();
  const date = new Date(dateString);

  const dueInSeconds = (date.getTime() - now.getTime()) / 1000;
  const isDueSoon = dueInSeconds < 60 * 60 * 24 * 3 && dueInSeconds > 60 * 60 * 24;
  const isAlmostDue = dueInSeconds < 60 * 60 * 24 && dueInSeconds > 0;
  const isOverDue = dueInSeconds < 0;

  const dueDateString = `Due ${format(date, 'PPP p')}`;
  const dueDateRelativeString = formatRelative(date, now, {
    weekStartsOn: startDayOfWeek,
  });

  return (
    <div
      className={cn(
        'flex items-center gap-1 align-middle text-xs',
        isDueSoon && 'text-yellow-400',
        isAlmostDue && 'text-orange-400',
        isOverDue && 'font-semibold text-red-400'
      )}
      title={dueDateString}
      data-test="tasks--task--due-text"
    >
      <CalendarIcon size={12} />
      <span>{dueDateRelativeString}</span>
    </div>
  );
};

export default TaskItemDueDate;
