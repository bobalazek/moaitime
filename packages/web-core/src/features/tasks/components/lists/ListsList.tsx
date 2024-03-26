import { UsersIcon } from 'lucide-react';

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

import UsageBadge from '../../../core/components/UsageBadge';
import { useListsStore } from '../../state/listsStore';
import ListItemActions from '../list-item/ListItemActions';
import ListsHeaderActions from './ListsHeaderActions';

export default function ListsList({
  isSubContent = false,
  onListSelect,
}: {
  isSubContent?: boolean;
  onListSelect?: (list?: List) => void;
}) {
  const { selectedList, lists, tasksCountMap, setSelectedList } = useListsStore();

  const Content = isSubContent ? DropdownMenuSubContent : DropdownMenuContent;
  const showHeader = !isSubContent;
  const showListActions = !isSubContent;

  const filteredLists = isSubContent
    ? lists.filter((list) => {
        if (!selectedList) {
          return !list.teamId;
        }

        return selectedList?.teamId === list.teamId;
      })
    : lists;
  const showUnlistedList = isSubContent ? !selectedList?.teamId : true;

  /* Yes, that is not a type - we annotate the unlisted as empty string */
  const unlistedCount = tasksCountMap[''] ?? 0;

  return (
    <Content className="w-56" align="end" data-test="tasks--lists-list--dropdown-menu">
      {showHeader && (
        <>
          <DropdownMenuLabel className="flex items-center justify-between">
            <div>
              <span className="mr-1 font-bold">Lists</span>
              <UsageBadge limitKey="listsMaxPerUserCount" usageKey="listsCount" />
            </div>
            <ListsHeaderActions />
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
        </>
      )}
      {filteredLists.length === 0 && (
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
        {showUnlistedList && (
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
        )}
        {filteredLists.map((list) => (
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
            <span className="w-full items-center gap-1  pr-6">
              <span className="break-words">{list.name}</span>
              {typeof tasksCountMap[list.id] !== 'undefined' && (
                <span className="text-gray-400"> ({tasksCountMap[list.id]})</span>
              )}
              {list.teamId && <UsersIcon className="ml-2 inline-block text-gray-400" size={16} />}
            </span>
            {showListActions && (
              <div className="absolute right-1 top-1 ml-2">
                <ListItemActions list={list} />
              </div>
            )}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </Content>
  );
}
