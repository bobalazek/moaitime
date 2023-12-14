import { FaCaretDown } from 'react-icons/fa';

import { DropdownMenu, DropdownMenuTrigger } from '@moaitime/web-ui';

import { useTasksStore } from '../../state/tasksStore';
import ListsSelectedListDropdownMenuContent from '../lists/ListsSelectedListDropdownMenuContent';

export default function TasksBodyHeaderListSelector() {
  const { selectedList } = useTasksStore();

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
            {selectedList ? selectedList.name : 'Tasks'}
          </span>
          <button
            type="button"
            className="rounded-full p-1 text-sm"
            data-test="tasks--body-header--lists-list--dropdown-menu--trigger-button"
          >
            <FaCaretDown />
          </button>
        </h3>
      </DropdownMenuTrigger>
      <ListsSelectedListDropdownMenuContent />
    </DropdownMenu>
  );
}
