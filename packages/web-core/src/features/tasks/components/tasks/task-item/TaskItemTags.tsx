import { TagIcon } from 'lucide-react';

import { Task as TaskType } from '@moaitime/shared-common';

const TaskItemTags = ({ task }: { task: TaskType }) => {
  if (!task.tags || task.tags.length === 0) {
    return null;
  }

  return (
    <div
      className="flex items-center space-x-1 align-middle text-[0.65rem]"
      data-test="tasks--task--tags"
    >
      <TagIcon size={12} />
      <div className="flex gap-1">
        {task.tags.map((tag) => {
          return (
            <span key={tag.id} className="rounded-full border border-white px-1.5 text-white">
              {tag.name}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default TaskItemTags;
