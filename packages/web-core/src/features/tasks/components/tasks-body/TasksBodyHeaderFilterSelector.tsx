import { FilterIcon } from 'lucide-react';

import {
  listSortOptions,
  SortDirectionEnum,
  TasksListSortFieldEnum,
} from '@moaitime/shared-common';
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

import { useListsStore } from '../../state/listsStore';

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
  } = useListsStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-full p-1 text-sm"
          data-test="tasks--body-header--list-selector--dropdown-menu--trigger-button"
          title="Filter tasks"
        >
          <FilterIcon />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
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
          {listSortOptions.map((sortOption) => (
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
