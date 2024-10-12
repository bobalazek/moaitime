import { MoreVerticalIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@moaitime/web-ui';

import { useGoalsStore } from '../../state/goalsStore';

export default function GoalsSettingsDialogGoalsActions() {
  const { setSelectedGoalDialogOpen, setDeletedGoalsDialogOpen } = useGoalsStore();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full p-1 text-sm"
          data-test="goals--settings--goals--actions--trigger-button"
        >
          <MoreVerticalIcon className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" data-test="goals--settings--goals--actions">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async (event) => {
            event.preventDefault();
            event.stopPropagation();

            setSelectedGoalDialogOpen(true, null);

            setOpen(false);
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          <span>Add New Goal</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async (event) => {
            event.preventDefault();
            event.stopPropagation();

            setDeletedGoalsDialogOpen(true);

            setOpen(false);
          }}
        >
          <TrashIcon className="mr-2 h-4 w-4" />
          <span>Show deleted goals</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
