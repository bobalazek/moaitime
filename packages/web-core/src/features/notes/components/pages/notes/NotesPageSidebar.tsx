import clsx from 'clsx';

import { useNotesStore } from '../../../state/notesStore';

const NotesPageSidebar = () => {
  const { notes, selectedNote, setSelectedNote } = useNotesStore();

  return (
    <div className="flex h-full w-96 flex-col border-r" data-test="notes--sidebar">
      <div data-test="notes--sidebar--inner">
        {notes.length === 0 && (
          <div className="flex h-full items-center justify-center p-4 text-sm text-gray-400">
            No notes yet
          </div>
        )}
        {notes.length > 0 && (
          <div className="flex h-full flex-col">
            {notes.map((note) => (
              <div
                key={note.id}
                className={clsx(
                  'flex cursor-pointer items-center justify-between px-2 py-2 text-xs hover:bg-gray-50',
                  note.id === selectedNote?.id && 'bg-gray-50'
                )}
                onClick={() => {
                  setSelectedNote(note);
                }}
              >
                <div className="flex items-center">
                  <div className="ml-2 text-sm">{note.title}</div>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(note.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPageSidebar;
