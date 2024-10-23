import { ChevronDownIcon, UsersIcon } from 'lucide-react';

import { DropdownMenu, DropdownMenuTrigger } from '@moaitime/web-ui';

import { useTeamsStore } from '../../../teams/state/teamsStore';
import { useListsStore } from '../../state/listsStore';
import ListsList from '../lists/ListsList';

export default function TasksBodyHeaderListSelector() {
  const { getTeamSync } = useTeamsStore();
  const { selectedList } = useListsStore();

  const team = selectedList?.teamId ? getTeamSync(selectedList.teamId) : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <h3 className="flex cursor-pointer items-center gap-2 text-xl font-bold">
          <span
            data-test="tasks--body-header--title"
            data-color={selectedList?.color}
            className="max-w-[260px] truncate border-l-4 border-transparent pl-2"
            style={{
              borderColor: selectedList?.color ?? undefined,
            }}
          >
            {selectedList ? selectedList.name : 'Unlisted'}
          </span>
          {selectedList?.teamId && (
            <span className="mr-2" title={`This list is shared with ${team?.name ?? 'your team'}`}>
              <UsersIcon
                className="inline text-gray-400"
                size={16}
                style={{
                  color: team?.color ?? undefined,
                }}
              />
            </span>
          )}
          <button
            type="button"
            className="rounded-full p-1 text-sm"
            data-test="tasks--body-header--lists-list--dropdown-menu--trigger-button"
          >
            <ChevronDownIcon />
          </button>
        </h3>
      </DropdownMenuTrigger>
      <ListsList />
    </DropdownMenu>
  );
}
