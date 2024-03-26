import { MoreVerticalIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@moaitime/web-ui';

import { useListsStore } from '../../state/listsStore';

const ListsHeaderActions = () => {
  const { setSelectedListDialogOpen, setDeletedListsDialogOpen } = useListsStore();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full p-1 text-sm"
          data-test="tasks--lists-list--header--dropdown-menu--trigger-button"
        >
          <MoreVerticalIcon className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        data-test="tasks--lists-list--header--dropdown-menu"
      >
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async (event) => {
            event.preventDefault();
            event.stopPropagation();

            setSelectedListDialogOpen(true, null);

            setOpen(false);
          }}
          data-test="tasks--lists-list--header--dropdown-menu--add-new-button"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          <span>Add new list</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async (event) => {
            event.preventDefault();
            event.stopPropagation();

            setDeletedListsDialogOpen(true);

            setOpen(false);
          }}
          data-test="tasks--lists-list--header--dropdown-menu--view-deleted-button"
        >
          <TrashIcon className="mr-2 h-4 w-4" />
          <span>Show deleted lists</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ListsHeaderActions;
