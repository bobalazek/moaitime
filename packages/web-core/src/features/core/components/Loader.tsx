import { LoaderIcon } from 'lucide-react';

export const Loader = () => {
  return (
    <div className="text-muted-foreground flex h-full items-center justify-center text-3xl">
      <LoaderIcon className="animate-spin" size={48} />
    </div>
  );
};
