import { UsersIcon } from 'lucide-react';

import { List } from '@moaitime/shared-common';

import ListItemActions from './ListItemActions';

export default function ListItem({ list }: { list: List }) {
  return (
    <div
      className="flex items-center justify-between rounded-lg border-l-4 px-2 py-1 outline-none hover:bg-gray-50 dark:hover:bg-gray-800"
      style={{ borderColor: list.color ?? 'transparent' }}
      data-test="lists--list-item"
    >
      <span className="w-full items-center gap-2">
        <span className="break-words">{list.name}</span>
        {list.teamId && (
          <span>
            {' '}
            <UsersIcon className="inline text-gray-400" size={16} />
          </span>
        )}
      </span>
      <ListItemActions list={list} />
    </div>
  );
}
