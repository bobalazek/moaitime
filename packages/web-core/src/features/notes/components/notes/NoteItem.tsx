import clsx from 'clsx';

import { Note } from '@moaitime/shared-common';

import { useNotesStore } from '../../state/notesStore';

const NoteItem = ({ note, isSelected }: { note: Note; isSelected?: boolean }) => {
  const { setSelectedNote } = useNotesStore();

  return (
    <div
      className={clsx(
        'flex cursor-pointer items-center justify-between px-2 py-2 text-xs hover:bg-gray-50 hover:dark:bg-gray-800',
        isSelected && 'bg-gray-50 dark:bg-gray-800'
      )}
      onClick={() => {
        setSelectedNote(note);
      }}
    >
      <div className="flex items-center">
        <div className="ml-2 text-sm">{note.title}</div>
      </div>
      <div className="text-xs text-gray-400">{new Date(note.createdAt).toLocaleDateString()}</div>
    </div>
  );
};

export default NoteItem;
