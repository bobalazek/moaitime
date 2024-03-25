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
      className="bg-background flex flex-wrap items-center justify-between gap-1 border-b px-4 py-3 text-center"
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
        <div className="text-lg md:text-2xl">{title}</div>
      </div>
      {children}
    </div>
  );
};

export default LayoutPageHeader;
