import { useNotesStore } from '../../../state/notesStore';

const NotesPageSidebar = () => {
  const { notes } = useNotesStore();

  return (
    <div className="flex h-full w-64 flex-col border-r" data-test="notes--sidebar">
      <div data-test="notes--sidebar--inner">
        {notes.length === 0 && (
          <div className="flex h-full items-center justify-center p-4 text-sm text-gray-400">
            No notes yet
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPageSidebar;
