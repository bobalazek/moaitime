import { FaFilter } from 'react-icons/fa';

import { SortDirectionEnum, sortOptions, TasksListSortFieldEnum } from '@moaitime/shared-common';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@moaitime/web-ui';

import { useTasksStore } from '../../state/tasksStore';

export default function TasksBodyHeaderFilterSelector() {
  const {
    selectedListTasksSortField,
    selectedListTasksSortDirection,
    selectedListTasksIncludeCompleted,
    selectedListTasksIncludeDeleted,
    setSelectedListTasksSortField,
    setSelectedListTasksSortDirection,
    setSelectedListTasksIncludeCompleted,
    setSelectedListTasksIncludeDeleted,
  } = useTasksStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-full p-1 text-sm hover:bg-gray-600"
          data-test="tasks--body-header--list-selector--dropdown-menu--trigger-button"
        >
          <FaFilter />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-gray-700"
        align="end"
        data-test="tasks--body-header--list-selector--dropdown-menu"
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="font-bold">Filters</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={selectedListTasksSortField}
          onValueChange={(value) => {
            setSelectedListTasksSortField(value as TasksListSortFieldEnum);
          }}
        >
          {sortOptions.map((sortOption) => (
            <DropdownMenuRadioItem
              key={sortOption.value}
              className="cursor-pointer"
              value={sortOption.value}
            >
              {sortOption.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={selectedListTasksSortDirection}
          onValueChange={(value) => {
            setSelectedListTasksSortDirection(value as SortDirectionEnum);
          }}
        >
          <DropdownMenuRadioItem className="cursor-pointer" value={SortDirectionEnum.ASC}>
            Ascending
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="cursor-pointer" value={SortDirectionEnum.DESC}>
            Descending
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={selectedListTasksIncludeCompleted}
          onCheckedChange={setSelectedListTasksIncludeCompleted}
        >
          Include completed?
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedListTasksIncludeDeleted}
          onCheckedChange={setSelectedListTasksIncludeDeleted}
        >
          Include deleted?
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
