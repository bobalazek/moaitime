import { clsx } from 'clsx';

import { Button, Input } from '@moaitime/web-ui';

import { useBreakpoint } from '../../../../core/hooks/useBreakpoint';
import { useNotesStore } from '../../../state/notesStore';
import NoteItem from '../../notes/NoteItem';

const NotesPageSidebar = () => {
  const {
    notes,
    selectedNote,
    selectedNoteData,
    notesSearch,
    setNotesSearch,
    setDraftAsSelectedNoteData,
  } = useNotesStore();
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
      <div className="p-2">
        <Input
          placeholder="Search"
          className="text-xs"
          type="search"
          value={notesSearch}
          onChange={(event) => setNotesSearch(event.target.value)}
          data-test="notes--sidebar--search-input"
        />
      </div>
      <div data-test="notes--sidebar--inner">
        {notes.length === 0 && (
          <div className="flex items-center justify-center p-2 text-sm text-gray-400">
            No notes found
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
