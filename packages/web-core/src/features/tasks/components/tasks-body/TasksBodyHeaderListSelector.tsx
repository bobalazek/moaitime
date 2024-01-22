import { ChevronDownIcon } from 'lucide-react';

import { DropdownMenu, DropdownMenuTrigger } from '@moaitime/web-ui';

import { useListsStore } from '../../state/listsStore';
import ListsSelectedListDropdownMenuContent from '../lists/ListsSelectedListDropdownMenuContent';

export default function TasksBodyHeaderListSelector() {
  const { selectedList } = useListsStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <h3 className="flex cursor-pointer items-center gap-2 text-xl font-bold">
          <span
            data-test="tasks--body-header--title"
            data-color={selectedList?.color}
            className="max-w-[260px] truncate border-l-4 border-transparent pl-2"
            style={{
              borderColor: selectedList?.color ?? 'transparent',
            }}
          >
            {selectedList ? selectedList.name : 'Unlisted'}
          </span>
          <button
            type="button"
            className="rounded-full p-1 text-sm"
            data-test="tasks--body-header--lists-list--dropdown-menu--trigger-button"
          >
            <ChevronDownIcon />
          </button>
        </h3>
      </DropdownMenuTrigger>
      <ListsSelectedListDropdownMenuContent />
    </DropdownMenu>
  );
}
