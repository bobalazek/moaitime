import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { Button } from '@moaitime/web-ui';

import { useNotesStore } from '../../../state/notesStore';

const NotesPageHeader = () => {
  const navigate = useNavigate();
  const { selectedNote, selectedNoteData, saveSelectedNoteData } = useNotesStore();

  return (
    <div
      className="flex items-center justify-between gap-4 border-b px-4 py-3 text-center text-2xl"
      data-test="notes--header"
    >
      <div className="flex space-x-2 align-middle">
        <button
          onClick={() => {
            navigate('/');
          }}
          data-test="notes--header--home-button"
        >
          <FaHome />
        </button>
        <div>Notes</div>
      </div>
      {selectedNoteData && (
        <div>
          <Button size="sm" onClick={saveSelectedNoteData}>
            {selectedNote?.id ? 'Save Note' : 'Create Note'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotesPageHeader;
