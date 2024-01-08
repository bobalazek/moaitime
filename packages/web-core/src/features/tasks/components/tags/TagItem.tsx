import { Tag } from '@moaitime/shared-common';

import TagItemActions from './TagItemActions';

export interface TagItemProps {
  tag: Tag;
}

export default function TagItem({ tag }: TagItemProps) {
  return (
    <div
      className="min-h-[2rem] rounded-lg p-1 outline-none hover:bg-gray-50 dark:hover:bg-gray-800"
      data-test="tasks--tag-item"
      data-tag-id={tag.id}
    >
      <div className="relative flex justify-between break-words px-6">
        <div>
          <span data-test="tasks--tag-item--name">{tag.name}</span>
          <span
            className="ml-2 inline-block h-2 w-2 rounded-full"
            style={{
              backgroundColor: tag.color ?? 'transparent',
            }}
          />
        </div>
        <TagItemActions tag={tag} />
      </div>
    </div>
  );
}
