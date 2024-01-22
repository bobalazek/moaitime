import { PlusIcon } from 'lucide-react';

import { List } from '@moaitime/shared-common';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
} from '@moaitime/web-ui';

import { useListsStore } from '../../state/listsStore';
import ListActions from './ListActions';

export default function ListsSelectedListDropdownMenuContent({
  isSubContent = false,
  onListSelect,
}: {
  isSubContent?: boolean;
  onListSelect?: (list?: List) => void;
}) {
  const { selectedList, lists, tasksCountMap, setSelectedList, setSelectedListDialogOpen } =
    useListsStore();

  const Content = isSubContent ? DropdownMenuSubContent : DropdownMenuContent;
  const showHeader = !isSubContent;
  const showListActions = !isSubContent;

  /* Yes, that is not a type - we annotate the unlisted as empty string */
  const unlistedCount = tasksCountMap[''] ?? 0;

  return (
    <Content className="w-56" align="end" data-test="tasks--lists-list--dropdown-menu">
      {showHeader && (
        <>
          <DropdownMenuLabel className="flex items-center justify-between">
            <span className="font-bold">Lists</span>
            <DropdownMenuItem asChild>
              <button
                type="button"
                className="cursor-pointer rounded-full"
                data-test="tasks--selected-list--dropdown-menu--add-new-button"
                onClick={() => {
                  setSelectedListDialogOpen(true, null);
                }}
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </DropdownMenuItem>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
        </>
      )}
      {lists.length === 0 && (
        <DropdownMenuItem className="flex cursor-pointer items-center justify-center text-gray-400">
          No lists found.
        </DropdownMenuItem>
      )}
      <DropdownMenuRadioGroup
        value={selectedList?.id ?? ''}
        onValueChange={async (value) => {
          const newSelectedList = lists.find((list) => list.id === value) ?? null;

          await setSelectedList(newSelectedList);
        }}
      >
        <DropdownMenuRadioItem
          value=""
          className="relative flex cursor-pointer justify-between border-l-4 border-l-transparent"
          onClick={(event) => {
            if (onListSelect) {
              event.preventDefault();
              event.stopPropagation();

              onListSelect(undefined);
            }
          }}
        >
          <span className="w-full break-words pr-6">
            <span>Unlisted</span>
            {unlistedCount > 0 && <span className="text-gray-400"> ({unlistedCount})</span>}
          </span>
        </DropdownMenuRadioItem>
        {lists.map((list) => (
          <DropdownMenuRadioItem
            key={list.id}
            value={list.id}
            className="relative flex cursor-pointer justify-between border-l-4 border-l-transparent"
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
              {typeof tasksCountMap[list.id] !== 'undefined' && (
                <span className="text-gray-400"> ({tasksCountMap[list.id]})</span>
              )}
            </span>
            {showListActions && <ListActions list={list} />}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </Content>
  );
}
