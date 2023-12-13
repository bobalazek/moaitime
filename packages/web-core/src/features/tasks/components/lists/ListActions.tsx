import { memo } from 'react';
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
  const { setListFormDialogOpen, setListDeleteAlertDialogOpen } = useTasksStore();

  return (
    <div className="absolute right-1 top-1 ml-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="rounded-full p-1 text-sm hover:bg-gray-600"
            data-test="tasks--list-actions--dropdown-menu--trigger-button"
          >
            <FaEllipsisV className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 bg-gray-700"
          align="end"
          data-test="tasks--list-actions--dropdown-menu"
        >
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={async (event) => {
              event.preventDefault();
              event.stopPropagation();

              setListFormDialogOpen(true, list);
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
