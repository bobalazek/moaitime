import clsx from 'clsx';

import { Note } from '@moaitime/shared-common';

import { useNotesStore } from '../../state/notesStore';

const NoteItem = ({ note, isSelected }: { note: Note; isSelected?: boolean }) => {
  const { setSelectedNote } = useNotesStore();

  return (
    <div
      className={clsx(
        'flex cursor-pointer items-center justify-between gap-2 px-2 py-2 text-xs hover:bg-gray-100 hover:dark:bg-gray-700',
        isSelected && 'bg-gray-200 dark:bg-gray-800'
      )}
      onClick={() => {
        setSelectedNote(note);
      }}
      data-test="notes--note"
    >
      <div className="truncate text-sm" title={note.title} data-test="notes--note--title">
        {note.title}
      </div>
      <div className="text-[0.65rem] text-gray-400" data-test="notes--note--created-at">
        {new Date(note.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default NoteItem;
