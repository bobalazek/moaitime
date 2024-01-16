import type { LucideIcon } from 'lucide-react';

import { ButtonHTMLAttributes, useEffect, useState } from 'react';

import { cn, Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from '@moaitime/web-ui';

export const AppButton: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement> & { icon: LucideIcon }
> = ({ icon, title, ...rest }) => {
  const [isPressed, setIsPressed] = useState(false);

  const Icon = icon;

  useEffect(() => {
    if (isPressed) {
      navigator?.vibrate?.(100);
    }
  }, [isPressed]);

  useEffect(() => {
    const handleMouseUp = () => setIsPressed(false);
    const handleTouchEnd = () => setIsPressed(false);

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const Button = (
    <button
      type="button"
      className={cn(
        `flex h-16 w-16 select-none items-center justify-center rounded-2xl bg-slate-600 shadow-lg transition-all hover:bg-slate-400 focus:bg-slate-400`,
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

  if (title) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{Button}</TooltipTrigger>
        <TooltipPortal container={document.body}>
          <TooltipContent className="z-50 text-xs">{title}</TooltipContent>
        </TooltipPortal>
      </Tooltip>
    );
  }

  return Button;
};
