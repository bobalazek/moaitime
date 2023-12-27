import { Button, useToast } from '@moaitime/web-ui';

import { useNotesStore } from '../../../state/notesStore';

const NotesPageHeaderButtons = () => {
  const { toast } = useToast();
  const { selectedNote, selectedNoteData, setSelectedNote, saveSelectedNoteData, deleteNote } =
    useNotesStore();

  if (!selectedNoteData) {
    return null;
  }

  const onDeleteButtonClick = async () => {
    if (!selectedNote) {
      return;
    }

    try {
      await deleteNote(selectedNote.id);

      toast({
        title: 'Success!',
        description: 'You have successfully deleted the note!',
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  const onCancelButtonClick = () => {
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
      {selectedNote && (
        <Button size="sm" variant="destructive" className="h-8" onClick={onDeleteButtonClick}>
          Delete
        </Button>
      )}
      <Button size="sm" variant="outline" className="h-8" onClick={onCancelButtonClick}>
        Cancel
      </Button>
      <Button size="sm" className="h-8" onClick={onSaveButtonClick}>
        {selectedNote?.id ? 'Save Note' : 'Create Note'}
      </Button>
    </div>
  );
};

export default NotesPageHeaderButtons;
