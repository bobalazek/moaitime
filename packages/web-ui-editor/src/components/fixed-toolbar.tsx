import { cn } from '../lib/utils';
import { Toolbar, ToolbarProps } from './toolbar';

const FixedToolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, ...props }: ToolbarProps, ref) => {
    return (
      <Toolbar
        ref={ref}
        className={cn(
          'supports-backdrop-blur:bg-background/60 border-b-border bg-background/95 sticky left-0 top-[57px] z-50 w-full justify-between overflow-x-auto rounded-t-lg border-b backdrop-blur',
          className
        )}
        {...props}
      />
    );
  }
);
FixedToolbar.displayName = 'FixedToolbar';

export { FixedToolbar };
