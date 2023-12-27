import { Button } from '@moaitime/web-ui';

import { useNotesStore } from '../../../state/notesStore';
import NoteEditor from '../../note-editor/NoteEditor';

const NotesPageMain = () => {
  const { selectedNoteData, setDraftAsSelectedNoteData } = useNotesStore();

  const onAddNewNoteButtonClick = () => {
    setDraftAsSelectedNoteData();
  };

  return (
    <main className="h-full w-full flex-grow overflow-auto p-4" data-test="notes--main">
      {!selectedNoteData && (
        <div className="flex h-full flex-col items-center justify-center text-center text-3xl text-gray-400">
          <div>No note selected</div>
          <div className="mt-2">
            <Button onClick={onAddNewNoteButtonClick}>Add new note</Button>
          </div>
        </div>
      )}
      {selectedNoteData && <NoteEditor />}
    </main>
  );
};

export default NotesPageMain;
