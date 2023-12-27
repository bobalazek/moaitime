import { memo, useState } from 'react';
import { FaEdit, FaEllipsisV, FaHistory, FaInfoCircle, FaList, FaTrash } from 'react-icons/fa';

import { Task } from '@moaitime/shared-common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@moaitime/web-ui';

import { useTasksStore } from '../../state/tasksStore';
import ListsSelectedListDropdownMenuContent from '../lists/ListsSelectedListDropdownMenuContent';

const TaskItemActions = memo(
  ({ task, onEditAndFocus }: { task: Task; onEditAndFocus: () => void }) => {
    const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);
    const { deleteTask, undeleteTask, moveTask, setSelectedTaskDialogOpen } = useTasksStore();

    return (
      <div className="absolute right-0 top-0 ml-2">
        <DropdownMenu open={dropdownMenuOpen} onOpenChange={setDropdownMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className="rounded-full p-1 text-sm"
              data-test="tasks--task--actions-dropdown-menu--trigger-button"
            >
              <FaEllipsisV />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            align="end"
            data-test="tasks--task--actions-dropdown-menu"
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  // This is a hacky way of working around the issue of radix, where if the dropdown menu closes,
                  // it will by default focus on one of the popover elements, which is not what we want.
                  // In this case we actually want it to focus on the text element.
                  setTimeout(() => {
                    onEditAndFocus();
                  }, 250);
                }}
              >
                <FaEdit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <FaList className="mr-2 h-4 w-4" />
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
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  setSelectedTaskDialogOpen(true, task);
                }}
              >
                <FaInfoCircle className="mr-2 h-4 w-4" />
                <span>More</span>
              </DropdownMenuItem>
              {!task.deletedAt && (
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={async () => {
                    await deleteTask(task.id);
                  }}
                >
                  <FaTrash className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              )}
              {task.deletedAt && (
                <>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={async () => {
                      await undeleteTask(task.id);
                    }}
                  >
                    <FaHistory className="mr-2 h-4 w-4" />
                    <span>Undelete</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={async () => {
                      await deleteTask(task.id, true);
                    }}
                  >
                    <FaTrash className="mr-2 h-4 w-4" />
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