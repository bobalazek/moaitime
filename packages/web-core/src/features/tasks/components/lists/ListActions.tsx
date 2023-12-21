import { memo, useState } from 'react';
import { FaEdit, FaEllipsisV, FaTrash } from 'react-icons/fa';

import { List } from '@moaitime/shared-common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@moaitime/web-ui';

import { useTasksStore } from '../../state/tasksStore';

const ListActions = memo(({ list }: { list: List }) => {
  const { setSelectedListDialogOpen, setListDeleteAlertDialogOpen } = useTasksStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute right-1 top-1 ml-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className="rounded-full p-1 text-sm"
            data-test="tasks--list-actions--dropdown-menu--trigger-button"
          >
            <FaEllipsisV className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          align="end"
          data-test="tasks--list-actions--dropdown-menu"
        >
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={async (event) => {
              event.preventDefault();
              event.stopPropagation();

              setSelectedListDialogOpen(true, list);

              setOpen(false);
            }}
          >
            <FaEdit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-red-500"
            onClick={async (event) => {
              event.preventDefault();
              event.stopPropagation();

              setListDeleteAlertDialogOpen(true, list);

              setOpen(false);
            }}
          >
            <FaTrash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

export default ListActions;
