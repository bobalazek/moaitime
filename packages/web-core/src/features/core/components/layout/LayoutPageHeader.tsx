import { ArrowLeftIcon } from 'lucide-react';
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
      <div className="flex gap-4 align-middle">
        <button
          onClick={() => {
            navigate('/');
          }}
          title="Go Back Home"
          data-test={`${testKey}--header--home-button`}
        >
          <ArrowLeftIcon />
        </button>
        <div>{title}</div>
      </div>
      {children}
    </div>
  );
};

export default LayoutPageHeader;
