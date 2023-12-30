import {
  CopyIcon,
  FileEditIcon,
  HistoryIcon,
  ListIcon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
} from 'lucide-react';
import { memo, useState } from 'react';

import { Task } from '@moaitime/shared-common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  ToastAction,
  useToast,
} from '@moaitime/web-ui';

import { useTasksStore } from '../../state/tasksStore';
import ListsSelectedListDropdownMenuContent from '../lists/ListsSelectedListDropdownMenuContent';

const TaskItemActions = memo(
  ({ task, onEditAndFocus }: { task: Task; onEditAndFocus: () => void }) => {
    const { duplicateTask, deleteTask, undeleteTask, moveTask, setSelectedTaskDialogOpen } =
      useTasksStore();
    const { toast } = useToast();
    const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);

    const onEditButtonClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();

      setSelectedTaskDialogOpen(true, task);
    };

    const onEditTextButtonClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();

      // This is a hacky way of working around the issue of radix, where if the dropdown menu closes,
      // it will by default focus on one of the popover elements, which is not what we want.
      // In this case we actually want it to focus on the text element.
      setTimeout(() => {
        onEditAndFocus();
      }, 250);
    };

    const onDuplicateButtonClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();

      duplicateTask(task.id);
    };

    const onUndeleteButtonClick = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      event.stopPropagation();

      try {
        await undeleteTask(task.id);

        toast({
          title: `Task "${task.name}" Undeleted`,
          description: 'The task was successfully undeleted!',
        });
      } catch (error) {
        // We are already handling the error by showing a toast message inside in the fetch function
      }
    };

    const onDeleteButtonClick = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      event.stopPropagation();

      try {
        await deleteTask(task.id);

        toast({
          title: `Task "${task.name}" Deleted`,
          description: 'The task was successfully deleted!',
          action: (
            <ToastAction altText="Undo" onClick={onUndeleteButtonClick}>
              Undo
            </ToastAction>
          ),
        });
      } catch (error) {
        // We are already handling the error by showing a toast message inside in the fetch function
      }
    };

    const onHardDeleteButtonClick = async () => {
      try {
        await deleteTask(task.id, true);

        toast({
          title: `Task "${task.name}" Deleted`,
          description: 'The task was successfully deleted!',
        });
      } catch (error) {
        // We are already handling the error by showing a toast message inside in the fetch function
      }
    };

    return (
      <div className="absolute right-0 top-[-2px] ml-2">
        <DropdownMenu open={dropdownMenuOpen} onOpenChange={setDropdownMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className="rounded-full p-1"
              data-test="tasks--task--actions-dropdown-menu--trigger-button"
            >
              <MoreVerticalIcon size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            align="end"
            data-test="tasks--task--actions-dropdown-menu"
          >
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer" onClick={onEditButtonClick}>
                <FileEditIcon className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={onEditTextButtonClick}>
                <PencilIcon className="mr-2 h-4 w-4" />
                <span>Edit Text</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={onDuplicateButtonClick}>
                <CopyIcon className="mr-2 h-4 w-4" />
                <span>Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <ListIcon className="mr-2 h-4 w-4" />
                  <span>Move</span>
                </DropdownMenuSubTrigger>
                <ListsSelectedListDropdownMenuContent
                  isSubContent={true}
                  onListSelect={async (newList) => {
                    await moveTask(task.id, newList.id);

                    setDropdownMenuOpen(false);
                  }}
                />
              </DropdownMenuSub>
              {!task.deletedAt && (
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={onDeleteButtonClick}
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              )}
              {task.deletedAt && (
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
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);

export default TaskItemActions;
