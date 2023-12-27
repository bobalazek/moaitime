import { clsx } from 'clsx';

import { Button } from '@moaitime/web-ui';

import { useBreakpoint } from '../../../../core/hooks/useBreakpoint';
import { useNotesStore } from '../../../state/notesStore';
import NoteEditor from '../../note-editor/NoteEditor';

const NotesPageMain = () => {
  const { selectedNoteData, setDraftAsSelectedNoteData } = useNotesStore();
  const isBreakpoint = useBreakpoint('md');

  const isVisible = isBreakpoint || (!isBreakpoint && selectedNoteData);

  const onAddNewNoteButtonClick = () => {
    setDraftAsSelectedNoteData();
  };

  return (
    <main
      className={clsx('h-full w-full flex-grow overflow-auto p-4', !isVisible && 'hidden')}
      data-test="notes--main"
    >
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
