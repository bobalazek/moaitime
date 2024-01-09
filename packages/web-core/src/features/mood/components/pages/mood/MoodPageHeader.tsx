import { HomeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import MoodPageHeaderButtons from './MoodPageHeaderButtons';

const MoodPageHeader = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center justify-between gap-4 border-b px-4 py-3 text-center text-2xl"
      data-test="mood--header"
    >
      <div className="flex space-x-2 align-middle">
        <button
          onClick={() => {
            navigate('/');
          }}
          title="Go home"
          data-test="mood--header--home-button"
        >
          <HomeIcon />
        </button>
        <div>Mood</div>
      </div>
      <MoodPageHeaderButtons />
    </div>
  );
};

export default MoodPageHeader;
