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
        `relative z-20 flex h-10 w-10 select-none items-center justify-center rounded-lg bg-slate-600 shadow-lg transition-all hover:bg-slate-600/70 focus:bg-slate-600/60 md:h-16 md:w-16 md:rounded-2xl`,
        isPressed && `scale-90`,
        className
      )}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      {...rest}
    >
      <Icon className="h-6 w-6 text-white md:h-9 md:w-9" />
      {badgeCount && badgeCount > 0 ? (
        <div className="absolute right-[-4px] top-[-4px] flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg">
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
