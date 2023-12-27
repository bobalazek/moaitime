import { useNotesStore } from '../../../state/notesStore';
import NoteItem from '../../notes/NoteItem';

const NotesPageSidebar = () => {
  const { notes, selectedNote } = useNotesStore();

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
              <NoteItem key={note.id} note={note} isSelected={selectedNote?.id === note.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPageSidebar;
