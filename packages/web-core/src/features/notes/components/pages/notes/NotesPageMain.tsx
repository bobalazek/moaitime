import { Button } from '@moaitime/web-ui';

import { useNotesStore } from '../../../state/notesStore';
import NoteEditor from '../../note-editor/NoteEditor';

const NotesPageMain = () => {
  const { selectedNote, setDraftAsSelectedNote } = useNotesStore();

  const onAddNewNoteButtonClick = () => {
    setDraftAsSelectedNote();
  };

  return (
    <main className="w-full p-4" data-test="notes--main">
      {!selectedNote && (
        <div className="flex h-full flex-col items-center justify-center text-center text-3xl text-gray-400">
          <div>No note selected</div>
          <div className="mt-2">
            <Button onClick={onAddNewNoteButtonClick}>Add new note</Button>
          </div>
        </div>
      )}
      {selectedNote && <NoteEditor note={selectedNote} />}
    </main>
  );
};

export default NotesPageMain;
