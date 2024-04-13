import type { LucideIcon } from 'lucide-react';

import { ButtonHTMLAttributes, useEffect, useState } from 'react';

import { cn, Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from '@moaitime/web-ui';

export const AppButton: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement> & { icon: LucideIcon; badgeCount?: number }
> = ({ icon, badgeCount, title, className, ...rest }) => {
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
        `relative z-20 flex h-12 w-12 select-none items-center justify-center rounded-lg bg-slate-600 shadow-md transition-all hover:bg-slate-600/70 focus:bg-slate-600/60 md:h-14 md:w-14 md:rounded-2xl lg:h-16 lg:w-16`,
        isPressed && `scale-90`,
        className
      )}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      {...rest}
    >
      <Icon className="h-7 w-7 text-white md:h-8 md:w-8 lg:h-9 lg:w-9" />
      {badgeCount && badgeCount > 0 ? (
        <div className="absolute right-[-4px] top-[-4px] flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-md">
          {badgeCount > 9 ? '9+' : badgeCount}
        </div>
      ) : null}
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
