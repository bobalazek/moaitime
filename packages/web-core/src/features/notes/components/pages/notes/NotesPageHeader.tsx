import { HomeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import NotesPageHeaderButtons from './NotesPageHeaderButtons';

const NotesPageHeader = () => {
  const navigate = useNavigate();

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
          <HomeIcon />
        </button>
        <div>Notes</div>
      </div>
      <NotesPageHeaderButtons />
    </div>
  );
};

export default NotesPageHeader;
