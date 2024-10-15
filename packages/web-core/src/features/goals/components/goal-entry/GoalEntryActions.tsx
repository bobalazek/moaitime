import { CheckIcon, MoreVerticalIcon, PencilIcon, TrashIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { Goal } from '@moaitime/shared-common';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  sonnerToast,
} from '@moaitime/web-ui';

import { useGoalsStore } from '../../state/goalsStore';

export const GoalEntryActions = ({ goal }: { goal: Goal }) => {
  const { deleteGoal, undeleteGoal, setSelectedGoalDialogOpen, completeGoal, uncompleteGoal } =
    useGoalsStore();
  const [open, setOpen] = useState(false);

  const onCompleteButtonClick = async () => {
    try {
      await completeGoal(goal.id);
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  const onUncompleteButtonClick = async () => {
    try {
      await uncompleteGoal(goal.id);
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  const onEditButtonClick = async () => {
    setSelectedGoalDialogOpen(true, goal);

    setOpen(false);
  };

  const onDeleteButtonClick = async () => {
    try {
      await deleteGoal(goal.id);

      setOpen(false);

      sonnerToast.success(`Goal deleted`, {
        description: 'The goal was successfully deleted!',
        action: {
          label: 'Undo',
          onClick: () => onUndeleteButtonClick(),
        },
      });
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  const onUndeleteButtonClick = async () => {
    try {
      await undeleteGoal(goal.id);

      setOpen(false);

      sonnerToast.success(`Goal undeleted`, {
        description: 'The goal was successfully undeleted!',
      });
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  const onHardDeleteButtonClick = async () => {
    try {
      await deleteGoal(goal.id, true);

      setOpen(false);

      sonnerToast.success(`Goal hard deleted`, {
        description: 'The goal was successfully hard deleted!',
      });
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          data-test="goal--goal-entry--actions-dropdown-menu--trigger-button"
        >
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent data-test="goal--goal-entry--actions-dropdown-menu">
        {!goal.completedAt && (
          <DropdownMenuItem className="cursor-pointer" onClick={onCompleteButtonClick}>
            <CheckIcon className="mr-2 h-4 w-4" />
            <span>Complete</span>
          </DropdownMenuItem>
        )}
        {goal.completedAt && (
          <DropdownMenuItem className="cursor-pointer" onClick={onUncompleteButtonClick}>
            <XIcon className="mr-2 h-4 w-4" />
            <span>Uncomplete</span>
          </DropdownMenuItem>
        )}
        {!goal.deletedAt && (
          <>
            <DropdownMenuItem className="cursor-pointer" onClick={onEditButtonClick}>
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
        {goal.deletedAt && (
          <>
            <DropdownMenuItem className="cursor-pointer" onClick={onUndeleteButtonClick}>
              <TrashIcon className="mr-2 h-4 w-4" />
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
};
