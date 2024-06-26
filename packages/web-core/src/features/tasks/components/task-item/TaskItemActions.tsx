import {
  CopyIcon,
  FileEditIcon,
  HistoryIcon,
  ListIcon,
  MoreVerticalIcon,
  PencilIcon,
  PlusSquareIcon,
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
  sonnerToast,
} from '@moaitime/web-ui';

import { useTasksStore } from '../../state/tasksStore';
import ListsList from '../lists/ListsList';

export type TaskItemActionsProps = {
  task: Task;
  onEditAndFocus: () => void;
  onAddSubTaskButtonClick?: () => void;
};

const TaskItemActions = memo(
  ({ task, onEditAndFocus, onAddSubTaskButtonClick }: TaskItemActionsProps) => {
    const { duplicateTask, deleteTask, undeleteTask, moveTask, setSelectedTaskDialogOpen } =
      useTasksStore();
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

    const onDeleteButtonClick = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      event.stopPropagation();

      try {
        await deleteTask(task.id);

        sonnerToast.success(`Task "${task.name}" deleted`, {
          description: 'The task was successfully deleted!',
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
      try {
        await deleteTask(task.id, true);

        sonnerToast.success(`Task "${task.name}" hard deleted`, {
          description: 'The task was successfully hard deleted!',
        });
      } catch (error) {
        // Already handled by the fetch function
      }
    };

    const onUndeleteButtonClick = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      event.stopPropagation();

      try {
        await undeleteTask(task.id);

        sonnerToast.success(`Task "${task.name}" undeleted`, {
          description: 'The task was successfully undeleted!',
          position: 'top-right',
        });
      } catch (error) {
        // Already handled by the fetch function
      }
    };

    return (
      <div className="absolute right-0 top-[-2px] ml-2">
        <DropdownMenu open={dropdownMenuOpen} onOpenChange={setDropdownMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className="rounded-full p-1"
              onClick={(event) => {
                event.stopPropagation();

                setDropdownMenuOpen(true);
              }}
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
              {onAddSubTaskButtonClick && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={(event) => {
                    event.stopPropagation();

                    onAddSubTaskButtonClick();
                  }}
                >
                  <PlusSquareIcon className="mr-2 h-4 w-4" />
                  <span>Add Sub Task</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <ListIcon className="mr-2 h-4 w-4" />
                  <span>Move</span>
                </DropdownMenuSubTrigger>
                <ListsList
                  isSubContent={true}
                  onListSelect={async (newList) => {
                    await moveTask(task.id, newList?.id ?? null);

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
