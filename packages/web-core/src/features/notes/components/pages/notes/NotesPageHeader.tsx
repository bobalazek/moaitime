import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { Button, useToast } from '@moaitime/web-ui';

import { useNotesStore } from '../../../state/notesStore';

const NotesPageHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedNote, selectedNoteData, setSelectedNote, saveSelectedNoteData, deleteNote } =
    useNotesStore();

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
    <div
      className="flex items-center justify-between gap-4 border-b px-4 py-3 text-center text-2xl"
      data-test="notes--header"
    >
      <div className="flex space-x-2 align-middle">
        <button
          onClick={() => {
            navigate('/');
          }}
          data-test="notes--header--home-button"
        >
          <FaHome />
        </button>
        <div>Notes</div>
      </div>
      {selectedNoteData && (
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
      )}
    </div>
  );
};

export default NotesPageHeader;
