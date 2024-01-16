import type { LucideIcon } from 'lucide-react';

import { ButtonHTMLAttributes, useEffect, useState } from 'react';

import { cn } from '@moaitime/web-ui';

export const AppButton: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement> & { icon: LucideIcon }
> = ({ icon, ...rest }) => {
  const [isPressed, setIsPressed] = useState(false);

  const Icon = icon;

  useEffect(() => {
    if (isPressed) {
      navigator?.vibrate?.(100);
    }
  }, [isPressed]);

  return (
    <button
      type="button"
      className={cn(
        `flex h-16 w-16 select-none items-center justify-center rounded-full border border-white bg-slate-600 shadow-lg transition-all hover:bg-slate-500 focus:bg-slate-400`,
        isPressed && `scale-90`
      )}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      {...rest}
    >
      <Icon className="h-8 w-8 text-white" />
    </button>
  );
};
