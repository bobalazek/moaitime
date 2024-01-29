import { MoreVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

import { MoodEntry } from '@moaitime/shared-common';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  sonnerToast,
} from '@moaitime/web-ui';

import { useMoodEntriesStore } from '../../state/moodEntriesStore';

export const MoodEntryActions = ({ moodEntry }: { moodEntry: MoodEntry }) => {
  const { deleteMoodEntry, undeleteMoodEntry, setSelectedMoodEntryDialogOpen } =
    useMoodEntriesStore();
  const [open, setOpen] = useState(false);

  const onEditButtonClick = async () => {
    setSelectedMoodEntryDialogOpen(true, moodEntry);

    setOpen(false);
  };

  const onDeleteButtonClick = async () => {
    try {
      await deleteMoodEntry(moodEntry.id);

      setOpen(false);

      sonnerToast.success(`Mood entry deleted`, {
        description: 'The mood entry was successfully deleted!',
        action: {
          label: 'Undo',
          onClick: () => onUndeleteButtonClick(),
        },
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  const onUndeleteButtonClick = async () => {
    try {
      await undeleteMoodEntry(moodEntry.id);

      setOpen(false);

      sonnerToast.success(`Mood entry undeleted`, {
        description: 'The mood entry was successfully undeleted!',
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  const onHardDeleteButtonClick = async () => {
    try {
      await deleteMoodEntry(moodEntry.id, true);

      setOpen(false);

      sonnerToast.success(`Mood entry hard deleted`, {
        description: 'The mood entry was successfully hard deleted!',
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          data-test="mood--mood-entry--actions-dropdown-menu--trigger-button"
        >
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent data-test="mood--mood-entry--actions-dropdown-menu">
        {!moodEntry.deletedAt && (
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
        {moodEntry.deletedAt && (
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
