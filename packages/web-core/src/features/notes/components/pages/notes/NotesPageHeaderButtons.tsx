import { MoreVerticalIcon, TrashIcon } from 'lucide-react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ToastAction,
  useToast,
} from '@moaitime/web-ui';

import { useNotesStore } from '../../../state/notesStore';

const NotesPageHeaderButtons = () => {
  const { toast } = useToast();
  const {
    selectedNote,
    selectedNoteData,
    selectedNoteDataChanged,
    setSelectedNote,
    saveSelectedNoteData,
    deleteNote,
    undeleteNote,
  } = useNotesStore();

  if (!selectedNoteData) {
    return null;
  }

  const onDeleteButtonClick = async () => {
    if (!selectedNote) {
      return;
    }

    try {
      const noteId = selectedNote.id;

      await deleteNote(noteId);

      toast({
        title: `Note "${selectedNote.title}" Deleted`,
        description: 'You have successfully deleted the note!',
        action: (
          <ToastAction altText="Undo" onClick={() => undeleteNote(noteId)}>
            Undo
          </ToastAction>
        ),
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  const onCancelButtonClick = () => {
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

  const onSaveButtonClick = () => {
    try {
      saveSelectedNoteData();

      toast({
        title: 'Success!',
        description: 'You have successfully saved the note!',
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

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
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={onDeleteButtonClick}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <Button size="sm" variant="outline" className="h-8" onClick={onCancelButtonClick}>
        Cancel
      </Button>
      <Button size="sm" className="h-8" onClick={onSaveButtonClick}>
        {selectedNote && <>Save Note</>}
        {!selectedNote && <>Create Note</>}
      </Button>
    </div>
  );
};

export default NotesPageHeaderButtons;
