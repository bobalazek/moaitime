import clsx from 'clsx';
import { TrashIcon, UsersIcon } from 'lucide-react';

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
      onClick={async () => {
        await setSelectedNote(note);
      }}
      data-test="notes--note"
    >
      <div className="truncate" title={note.title} data-test="notes--note--title">
        {note.title || <span className="italic">Untitled</span>}
        {note.teamId && <UsersIcon className="ml-2 inline-block" size={12} />}
      </div>

      {note.deletedAt && (
        <div
          className="text-muted-foreground text-xs"
          title={`Deleted at ${new Date(note.deletedAt).toLocaleString()}`}
          data-test="notes--note--deleted-at"
        >
          <TrashIcon className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

export default NoteItem;
