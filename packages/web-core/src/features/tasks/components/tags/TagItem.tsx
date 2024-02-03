import { UsersIcon } from 'lucide-react';

import { Tag } from '@moaitime/shared-common';

import TagItemActions from './TagItemActions';

export interface TagItemProps {
  tag: Tag;
}

export default function TagItem({ tag }: TagItemProps) {
  return (
    <div
      className="min-h-[2rem] rounded-lg border-l-4 p-1 outline-none hover:bg-gray-50 dark:hover:bg-gray-800"
      data-test="tasks--tag-item"
      data-tag-id={tag.id}
      style={{
        borderColor: tag.color ?? 'transparent',
      }}
    >
      <div className="relative flex justify-between break-words px-2">
        <div>
          <div>
            <span data-test="tasks--tag-item--name">{tag.name}</span>
            {tag.teamId && (
              <span className="ml-1">
                {' '}
                <UsersIcon className="inline text-gray-400" size={16} />
              </span>
            )}
          </div>
          {tag.deletedAt && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Deleted at {new Date(tag.deletedAt).toLocaleString()}
            </div>
          )}
        </div>
        <TagItemActions tag={tag} />
      </div>
    </div>
  );
}
