import { clsx } from 'clsx';
import { format, formatRelative } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

import { Note } from '@moaitime/shared-common';
import { Button } from '@moaitime/web-ui';

import { useAuthStore } from '../../../../auth/state/authStore';
import { useBreakpoint } from '../../../../core/hooks/useBreakpoint';
import { useNotesStore } from '../../../state/notesStore';
import NoteEditor from '../../note-editor/NoteEditor';

const NotesPageMainMetadata = ({ note }: { note: Note }) => {
  const { auth } = useAuthStore();

  const now = new Date();
  const generalTimezone = auth?.user?.settings?.generalTimezone ?? 'UTC';

  return (
    <div className="text-muted-foreground mt-3 flex justify-end gap-3 text-[0.65rem]">
      <div title={format(zonedTimeToUtc(note.createdAt, generalTimezone), 'PPP p')}>
        Created: {formatRelative(new Date(note.createdAt), now)}
      </div>
      <div title={format(zonedTimeToUtc(note.updatedAt, generalTimezone), 'PPP p')}>
        Updated: {formatRelative(new Date(note.updatedAt), now)}
      </div>
    </div>
  );
};

const NotesPageMain = () => {
  const { selectedNote, selectedNoteData, setDraftAsSelectedNoteData } = useNotesStore();
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
      {selectedNote && <NotesPageMainMetadata note={selectedNote} />}
    </main>
  );
};

export default NotesPageMain;
