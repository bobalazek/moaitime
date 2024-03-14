import { HistoryIcon, MoreVerticalIcon, TrashIcon } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  sonnerToast,
} from '@moaitime/web-ui';

import { useNotesStore } from '../../../state/notesStore';

const NotesPageHeaderButtons = () => {
  const {
    selectedNote,
    selectedNoteData,
    selectedNoteDataChanged,
    setSelectedNote,
    saveSelectedNoteData,
    deleteNote,
    undeleteNote,
  } = useNotesStore();

  const onDeleteButtonClick = async () => {
    if (!selectedNote) {
      return;
    }

    try {
      const noteId = selectedNote.id;

      await deleteNote(noteId);

      setSelectedNote(null);

      sonnerToast.success(`Note "${selectedNote.title}" Deleted`, {
        description: 'You have successfully deleted the note!',
        action: {
          label: 'Undo',
          onClick: () => undeleteNote(noteId),
        },
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  const onHardDeleteButtonClick = async () => {
    if (!selectedNote) {
      return;
    }

    try {
      await deleteNote(selectedNote.id, true);

      sonnerToast.success(`Note "${selectedNote.title}" hard deleted`, {
        description: 'The note was successfully hard deleted!',
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  const onUndeleteButtonClick = async () => {
    if (!selectedNote) {
      return;
    }

    try {
      await undeleteNote(selectedNote.id);

      sonnerToast.success(`Note "${selectedNote.title}" undeleted`, {
        description: 'The note was successfully undeleted!',
        position: 'top-right',
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  const onCancelButtonClick = async () => {
    if (selectedNoteDataChanged) {
      const response = confirm(
        'You have unsaved changes. Are you sure you want to stop editing this note?'
      );
      if (!response) {
        return;
      }
    }

    setSelectedNote(null);
  };

  const onSaveButtonClick = useCallback(async () => {
    try {
      await saveSelectedNoteData();

      sonnerToast.success('Success!', {
        description: 'You have successfully saved the note!',
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  }, [saveSelectedNoteData]);

  const debouncedSave = useDebouncedCallback(async () => {
    await onSaveButtonClick();
  }, 3000);

  useEffect(() => {
    if (!selectedNoteDataChanged) {
      return;
    }

    debouncedSave();
  }, [selectedNoteDataChanged, selectedNoteData, debouncedSave]);

  if (!selectedNoteData) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {selectedNoteDataChanged && (
        <div className="text-muted-foreground flex items-center text-xs">(unsaved changes)</div>
      )}
      {selectedNote && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="rounded-full p-1 text-sm"
              data-test="notes--header--note-actions--dropdown-menu--trigger-button"
            >
              <MoreVerticalIcon className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent data-test="notes--header--note-actions--dropdown-menu">
            {!selectedNote.deletedAt && (
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={onDeleteButtonClick}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            )}
            {selectedNote.deletedAt && (
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
      )}
      <Button size="sm" variant="outline" className="h-8" onClick={onCancelButtonClick}>
        Cancel
      </Button>
      <Button
        size="sm"
        className="h-8"
        onClick={onSaveButtonClick}
        disabled={!selectedNoteDataChanged}
      >
        {selectedNote && <>Save Note</>}
        {!selectedNote && <>Create Note</>}
      </Button>
    </div>
  );
};

export default NotesPageHeaderButtons;
