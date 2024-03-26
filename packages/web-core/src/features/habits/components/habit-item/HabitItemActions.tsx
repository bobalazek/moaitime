import { FileEditIcon, HistoryIcon, MoreVerticalIcon, TrashIcon } from 'lucide-react';
import { memo, useState } from 'react';

import { Habit } from '@moaitime/shared-common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  sonnerToast,
} from '@moaitime/web-ui';

import { useHabitsStore } from '../../state/habitsStore';

const HabitItemActions = memo(({ habit }: { habit: Habit }) => {
  const { deleteHabit, undeleteHabit, setSelectedHabitDialogOpen } = useHabitsStore();
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);

  const onEditButtonClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();

    setSelectedHabitDialogOpen(true, habit);
  };

  const onDeleteButtonClick = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();

    try {
      await deleteHabit(habit.id);

      sonnerToast.success(`Habit "${habit.name}" deleted`, {
        description: 'The habit was successfully deleted!',
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
      await deleteHabit(habit.id, true);

      sonnerToast.success(`Habit "${habit.name}" hard deleted`, {
        description: 'The habit was successfully hard deleted!',
      });
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  const onUndeleteButtonClick = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();

    try {
      await undeleteHabit(habit.id);

      sonnerToast.success(`Habit "${habit.name}" undeleted`, {
        description: 'The habit was successfully undeleted!',
        position: 'top-right',
      });
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  return (
    <DropdownMenu open={dropdownMenuOpen} onOpenChange={setDropdownMenuOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full p-1"
          onClick={(event) => {
            event.stopPropagation();

            setDropdownMenuOpen(true);
          }}
          data-test="habits--habit--actions-dropdown-menu--trigger-button"
        >
          <MoreVerticalIcon size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        data-test="habits--habit--actions-dropdown-menu"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" onClick={onEditButtonClick}>
            <FileEditIcon className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          {!habit.deletedAt && (
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={onDeleteButtonClick}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          )}
          {habit.deletedAt && (
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
  );
});

export default HabitItemActions;
