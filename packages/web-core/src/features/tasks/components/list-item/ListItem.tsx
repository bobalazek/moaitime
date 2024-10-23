import { UsersIcon } from 'lucide-react';

import { List } from '@moaitime/shared-common';

import { useTeamsStore } from '../../../teams/state/teamsStore';
import ListItemActions from './ListItemActions';

export default function ListItem({ list, hideActions }: { list: List; hideActions?: boolean }) {
  const { getTeamSync } = useTeamsStore();

  const team = list.teamId ? getTeamSync(list.teamId) : null;

  return (
    <div
      className="flex items-center justify-between rounded-lg border-l-4 px-2 py-1 outline-none hover:bg-gray-50 dark:hover:bg-gray-800"
      style={{ borderColor: list.color ?? 'transparent' }}
      data-test="lists--list-item"
    >
      <span className="w-full">
        <span className="break-words">{list.name}</span>
        {list.teamId && (
          <span title={`This list is shared with ${team?.name ?? 'your team'}`}>
            <UsersIcon
              className="ml-2 inline-block text-gray-400"
              size={16}
              style={{ color: team?.color ?? undefined }}
            />
          </span>
        )}
      </span>
      {!hideActions && <ListItemActions list={list} />}
    </div>
  );
}
