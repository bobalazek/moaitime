import { clsx } from 'clsx';

import { Button } from '@moaitime/web-ui';

import { useBreakpoint } from '../../../../core/hooks/useBreakpoint';
import { useNotesStore } from '../../../state/notesStore';
import NoteItem from '../../notes/NoteItem';

const NotesPageSidebar = () => {
  const { notes, selectedNote, selectedNoteData, setDraftAsSelectedNoteData } = useNotesStore();
  const isBreakpoint = useBreakpoint('md');

  const isVisible = isBreakpoint || (!isBreakpoint && !selectedNoteData);

  const onAddNewNoteButtonClick = () => {
    setDraftAsSelectedNoteData();
  };

  return (
    <div
      className={clsx(
        'flex h-full w-full max-w-full flex-col overflow-auto border-r md:max-w-[320px]',
        !isVisible && 'hidden'
      )}
      data-test="notes--sidebar"
    >
      <div data-test="notes--sidebar--inner">
        {notes.length === 0 && (
          <div className="flex items-center justify-center p-4 text-sm text-gray-400">
            No notes yet
          </div>
        )}
        {notes.length > 0 && (
          <div className="flex flex-col">
            {notes.map((note) => (
              <NoteItem key={note.id} note={note} isSelected={selectedNote?.id === note.id} />
            ))}
          </div>
        )}
        <div className="p-4 text-center">
          <Button size="sm" variant="outline" onClick={onAddNewNoteButtonClick}>
            Add new note
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotesPageSidebar;
