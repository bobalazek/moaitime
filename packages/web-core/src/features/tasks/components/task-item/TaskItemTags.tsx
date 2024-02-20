import { TagIcon } from 'lucide-react';

import { Task as TaskType } from '@moaitime/shared-common';

import { getTextColor } from '../../../core/utils/ColorHelpers';
import { useTagsStore } from '../../state/tagsStore';

const TaskItemTags = ({ task }: { task: TaskType }) => {
  const { tags } = useTagsStore();

  if (!task.tags || task.tags.length === 0) {
    return null;
  }

  const tagsMap = new Map(tags.map((tag) => [tag.id, tag]));

  return (
    <div
      className="flex items-center justify-start space-x-1 align-middle"
      data-test="tasks--task--tags"
    >
      <TagIcon size={12} className="min-w-[12px]" />
      <div className="text-[0.65rem]">
        {task.tags.map((tag) => {
          if (tagsMap.has(tag.id)) {
            tag = tagsMap.get(tag.id) as typeof tag; // this will be the newer version of the tag in case we have updated from the settings
          }

          const backgroundColor = tag.color ?? '#666666';
          const color = getTextColor(backgroundColor);

          return (
            <span
              key={tag.id}
              className="m-[2px] inline-block rounded-full px-1.5 py-[1px] text-white"
              data-test="tasks--task--tags--tag"
              data-tag-color={backgroundColor}
              style={{
                color,
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
