import { MoreVerticalIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@moaitime/web-ui';

import { useHabitsStore } from '../../state/habitsStore';

export default function HabitsSettingsDialogHabitsActions() {
  const { setSelectedHabitDialogOpen, setDeletedHabitsDialogOpen } = useHabitsStore();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full p-1 text-sm"
          data-test="habits--settings--habits--actions--trigger-button"
        >
          <MoreVerticalIcon className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" data-test="habits--settings--habits--actions">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async (event) => {
            event.preventDefault();
            event.stopPropagation();

            setSelectedHabitDialogOpen(true, null);

            setOpen(false);
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          <span>Add New Habit</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async (event) => {
            event.preventDefault();
            event.stopPropagation();

            setDeletedHabitsDialogOpen(true);

            setOpen(false);
          }}
        >
          <TrashIcon className="mr-2 h-4 w-4" />
          <span>Show deleted habits</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
