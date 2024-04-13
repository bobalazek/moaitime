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
      className="bg-background flex flex-wrap items-center gap-2 border-b px-4 py-3 text-center"
      data-test={`${testKey}--header`}
    >
      <button
        title="Go Back Home"
        className="mr-auto"
        onClick={() => {
          navigate('/');
        }}
        data-test={`${testKey}--header--home-button`}
      >
        <ArrowLeftIcon />
      </button>
      <div className="flex min-w-0 flex-auto justify-start text-lg md:text-2xl">{title}</div>
      <div className="ml-auto">{children}</div>
    </div>
  );
};

export default LayoutPageHeader;
