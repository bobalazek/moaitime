import { HistoryIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { memo, useState } from 'react';

import { List } from '@moaitime/shared-common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  sonnerToast,
} from '@moaitime/web-ui';

import { useListsStore } from '../../state/listsStore';

const ListItemActions = memo(({ list }: { list: List }) => {
  const { deleteList, undeleteList, setSelectedListDialogOpen, setListDeleteAlertDialogOpen } =
    useListsStore();
  const [open, setOpen] = useState(false);

  const onDeleteButtonClick = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();

    try {
      await deleteList(list.id);

      sonnerToast.success(`List "${list.name}" deleted`, {
        description: 'The list was successfully deleted!',
        action: {
          label: 'Undo',
          onClick: (event) => onUndeleteButtonClick(event),
        },
        position: 'top-right',
      });
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  const onHardDeleteButtonClick = async () => {
    setListDeleteAlertDialogOpen(true, list);
  };

  const onUndeleteButtonClick = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();

    try {
      await undeleteList(list.id);

      sonnerToast.success(`List "${list.name}" undeleted`, {
        description: 'The list was successfully undeleted!',
        position: 'top-right',
      });
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full p-1 text-sm"
          data-test="tasks--list-actions--dropdown-menu--trigger-button"
        >
          <MoreVerticalIcon className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        data-test="tasks--list-actions--dropdown-menu"
      >
        {!list.deletedAt && (
          <>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={async (event) => {
                event.preventDefault();
                event.stopPropagation();

                setSelectedListDialogOpen(true, list);

                setOpen(false);
              }}
            >
              <PencilIcon className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={onDeleteButtonClick}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </>
        )}
        {list.deletedAt && (
          <>
            <DropdownMenuItem className="cursor-pointer" onClick={onUndeleteButtonClick}>
              <HistoryIcon className="mr-2 h-4 w-4" />
              <span>Undelete</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={onHardDeleteButtonClick}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              <span>Hard Delete</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default ListItemActions;
