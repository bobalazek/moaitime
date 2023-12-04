import { FaPlus } from 'react-icons/fa';

import { ListInterface } from '@myzenbuddy/shared-common';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
} from '@myzenbuddy/web-ui';

import { useTasksStore } from '../../state/tasksStore';
import ListActions from './ListActions';

export default function ListsSelectedListDropdownMenuContent({
  isSubContent = false,
  onListSelect,
}: {
  isSubContent?: boolean;
  onListSelect?: (list: ListInterface) => void;
}) {
  const { selectedList, lists, setSelectedList, setListFormDialogOpen } = useTasksStore();

  const Content = isSubContent ? DropdownMenuSubContent : DropdownMenuContent;
  const showHeader = !isSubContent;
  const showListActions = !isSubContent;

  return (
    <Content className="w-56 bg-gray-700" align="end" data-test="tasks--lists-list--dropdown-menu">
      {showHeader && (
        <>
          <DropdownMenuLabel className="flex items-center justify-between">
            <span className="font-bold">Lists</span>
            <DropdownMenuItem asChild>
              <button
                type="button"
                className="cursor-pointer hover:text-gray-300"
                data-test="tasks--selected-list--dropdown-menu--add-new-button"
                onClick={() => {
                  setListFormDialogOpen(true, null);
                }}
              >
                <FaPlus className="h-4 w-4" />
              </button>
            </DropdownMenuItem>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
        </>
      )}
      {lists.length === 0 && (
        <DropdownMenuItem className="flex cursor-pointer items-center justify-center text-gray-400">
          No lists found yet.
        </DropdownMenuItem>
      )}
      <DropdownMenuRadioGroup
        value={selectedList?.id}
        onValueChange={async (value) => {
          const newSelectedList = lists.find((list) => list.id === value) ?? null;
          await setSelectedList(newSelectedList);
        }}
      >
        {lists.map((list) => (
          <DropdownMenuRadioItem
            key={list.id}
            value={list.id}
            className="relative flex cursor-pointer justify-between border-l-4 border-l-transparent hover:bg-gray-600"
            style={{ borderColor: list.color ?? 'transparent' }}
            onClick={(event) => {
              if (onListSelect) {
                event.preventDefault();
                event.stopPropagation();

                onListSelect(list);
              }
            }}
          >
            <span className="w-full break-words pr-6">
              <span>{list.name}</span>
              {typeof list.tasksCount !== 'undefined' && <span className="text-gray-400"> ({list.tasksCount})</span>}
            </span>
            {showListActions && <ListActions list={list} />}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </Content>
  );
}
