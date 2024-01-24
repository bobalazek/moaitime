import { HomeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export type LayoutPageHeaderProps = {
  testKey: string;
  title: string | React.ReactNode;
  children?: React.ReactNode;
};

const LayoutPageHeader = ({ testKey, title, children }: LayoutPageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center justify-between gap-4 border-b px-4 py-3 text-center text-2xl"
      data-test={`${testKey}--header`}
    >
      <div className="flex space-x-2 align-middle">
        <button
          onClick={() => {
            navigate('/');
          }}
          title="Go home"
          data-test={`${testKey}--header--home-button`}
        >
          <HomeIcon />
        </button>
        <div>{title}</div>
      </div>
      {children}
    </div>
  );
};

export default LayoutPageHeader;
