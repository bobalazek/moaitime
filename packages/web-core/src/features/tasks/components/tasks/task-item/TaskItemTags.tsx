import { colord } from 'colord';
import { TagIcon } from 'lucide-react';

import { Task as TaskType } from '@moaitime/shared-common';

const TaskItemTags = ({ task }: { task: TaskType }) => {
  if (!task.tags || task.tags.length === 0) {
    return null;
  }

  return (
    <div
      className="flex items-center justify-start space-x-1 align-middle"
      data-test="tasks--task--tags"
    >
      <TagIcon size={12} className="min-w-[12px]" />
      <div className="text-[0.65rem]">
        {task.tags.map((tag) => {
          const backgroundColor = tag.color ?? '#666666';
          const textColor = backgroundColor
            ? colord(backgroundColor).isDark()
              ? 'white'
              : 'black'
            : '';

          return (
            <span
              key={tag.id}
              className="m-[2px] inline-block rounded-full px-1.5 py-[1px] text-white"
              data-test="tasks--task--tags--tag"
              style={{
                color: textColor,
                backgroundColor,
              }}
            >
              {tag.name}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default TaskItemTags;
