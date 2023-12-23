import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NotesPageHeader = () => {
  const navigate = useNavigate();

  return (
    <div
      className="items-center gap-4 border-b px-4 py-3 text-center text-2xl md:flex md:justify-between"
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
    </div>
  );
};

export default NotesPageHeader;
