import {
  ArrowDownIcon,
  ArrowUpIcon,
  FileEditIcon,
  HistoryIcon,
  MoreVerticalIcon,
  TrashIcon,
} from 'lucide-react';
import { memo, useState } from 'react';

import { Goal } from '@moaitime/shared-common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  sonnerToast,
} from '@moaitime/web-ui';

import { useGoalsStore } from '../../state/goalsStore';

export type GoalItemActionsProps = {
  goal: Goal;
};

const GoalItemActions = memo(({ goal }: GoalItemActionsProps) => {
  const { goals, deleteGoal, undeleteGoal, reorderGoals, setSelectedGoalDialogOpen } =
    useGoalsStore();
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);

  const hideMoveUp = goals.findIndex((g) => g.id === goal.id) === 0;
  const hideMoveDown = goals.findIndex((g) => g.id === goal.id) === goals.length - 1;

  const onEditButtonClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();

    setSelectedGoalDialogOpen(true, goal);
  };

  const onMoveUpButtonClick = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();

    try {
      let previousGoalId: string | undefined = undefined;
      for (let i = 1; i < goals.length; i++) {
        if (goals[i].id !== goal.id) {
          continue;
        }

        previousGoalId = goals[i - 1].id;
        break;
      }

      if (!previousGoalId) {
        return;
      }

      await reorderGoals(goal.id, previousGoalId);

      sonnerToast.success(`Goal "${goal.name}" moved up`, {
        description: 'The goal was successfully moved up!',
      });
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  const onMoveDownButtonClick = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();

    try {
      const currentIndex = goals.findIndex((g) => g.id === goal.id);
      const nextGoal =
        currentIndex >= 0 && currentIndex < goals.length - 1 ? goals[currentIndex + 1] : undefined;
      const nextGoalId = nextGoal ? nextGoal.id : undefined;

      if (!nextGoalId) {
        return;
      }

      await reorderGoals(goal.id, nextGoalId);

      sonnerToast.success(`Goal "${goal.name}" moved down`, {
        description: 'The goal was successfully moved down!',
      });
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  const onDeleteButtonClick = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();

    try {
      await deleteGoal(goal.id);

      sonnerToast.success(`Goal "${goal.name}" deleted`, {
        description: 'The goal was successfully deleted!',
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
      await deleteGoal(goal.id, true);

      sonnerToast.success(`Goal "${goal.name}" hard deleted`, {
        description: 'The goal was successfully hard deleted!',
      });
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  const onUndeleteButtonClick = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();

    try {
      await undeleteGoal(goal.id);

      sonnerToast.success(`Goal "${goal.name}" undeleted`, {
        description: 'The goal was successfully undeleted!',
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
          data-test="goals--goal--actions-dropdown-menu--trigger-button"
        >
          <MoreVerticalIcon size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        data-test="goals--goal--actions-dropdown-menu"
      >
        <DropdownMenuGroup>
          {!goal.deletedAt && (
            <>
              <DropdownMenuItem className="cursor-pointer" onClick={onEditButtonClick}>
                <FileEditIcon className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              {!hideMoveUp && (
                <DropdownMenuItem className="cursor-pointer" onClick={onMoveUpButtonClick}>
                  <ArrowUpIcon className="mr-2 h-4 w-4" />
                  <span>Move Up</span>
                </DropdownMenuItem>
              )}
              {!hideMoveDown && (
                <DropdownMenuItem className="cursor-pointer" onClick={onMoveDownButtonClick}>
                  <ArrowDownIcon className="mr-2 h-4 w-4" />
                  <span>Move Down</span>
                </DropdownMenuItem>
              )}
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
          {goal.deletedAt && (
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

export default GoalItemActions;
