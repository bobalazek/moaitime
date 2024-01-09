import { LoaderIcon } from 'lucide-react';

export const Loader = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground">
        <LoaderIcon />
      </p>
    </div>
  );
};
