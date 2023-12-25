import * as ToolbarPrimitive from '@radix-ui/react-toolbar';
import { cva, VariantProps } from 'class-variance-authority';
import { Children, forwardRef, ReactNode, useEffect, useState } from 'react';

import { cn } from '../lib/utils';
import { Icons } from './icons';
import { Separator } from './separator';
import { ToggleProps, toggleVariants } from './toggle';
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from './tooltip';

const toolbarVariants = cva(
  'relative flex select-none items-stretch gap-1 bg-background align-middle'
);

export const linkVariants = cva('font-medium underline underline-offset-4');

const ToolbarToggleGroup = ToolbarPrimitive.ToggleGroup;

export interface ToolbarProps extends React.ComponentPropsWithoutRef<typeof Toolbar> {}

const Toolbar = forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Root> &
    VariantProps<typeof toolbarVariants>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Root ref={ref} className={cn(toolbarVariants(), className)} {...props} />
));
Toolbar.displayName = ToolbarPrimitive.Root.displayName;

const ToolbarLink = forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Link>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Link> & VariantProps<typeof linkVariants>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Link ref={ref} className={cn(linkVariants(), className)} {...props} />
));
ToolbarLink.displayName = ToolbarPrimitive.Link.displayName;

const ToolbarSeparator = forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Separator
    ref={ref}
    className={cn('bg-border shrink-0', 'my-1 w-[1px]', className)}
    {...props}
  />
));
ToolbarSeparator.displayName = ToolbarPrimitive.Separator.displayName;

export interface ToolbarButtonProps
  extends React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Button>,
    VariantProps<typeof toggleVariants>,
    Omit<ToggleProps, 'type'> {
  buttonType?: 'button' | 'toggle';
  pressed?: boolean;
  tooltip?: ReactNode;
  isDropdown?: boolean;
}

const ToolbarButton = forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Button>,
  ToolbarButtonProps
>(({ className, variant, size = 'sm', isDropdown, children, pressed, tooltip, ...props }, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const content =
    typeof pressed === 'boolean' ? (
      <ToolbarToggleGroup type="single" value="single">
        <ToolbarToggleItem
          ref={ref}
          className={cn(
            toggleVariants({
              variant,
              size,
            }),
            isDropdown && 'my-1 justify-between pr-1',
            className
          )}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value={(pressed ? 'single' : '') as any}
          {...props}
        >
          <div className="flex flex-1">{children}</div>
          <div>{isDropdown && <Icons.arrowDown className="ml-0.5 h-4 w-4" data-icon />}</div>
        </ToolbarToggleItem>
      </ToolbarToggleGroup>
    ) : (
      <ToolbarPrimitive.Button
        ref={ref}
        className={cn(
          toggleVariants({
            variant,
            size,
          }),
          isDropdown && 'pr-1',
          className
        )}
        {...props}
      >
        {children}
      </ToolbarPrimitive.Button>
    );

  return isLoaded && tooltip ? (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>

      <TooltipPortal>
        <TooltipContent>{tooltip}</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  ) : (
    <>{content}</>
  );
});
ToolbarButton.displayName = ToolbarPrimitive.Button.displayName;

const ToolbarToggleItem = forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.ToggleItem>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.ToggleItem> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <ToolbarPrimitive.ToggleItem
    ref={ref}
    className={cn(toggleVariants({ variant, size }), className)}
    {...props}
  />
));
ToolbarToggleItem.displayName = ToolbarPrimitive.ToggleItem.displayName;

const ToolbarGroup = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { noSeparator?: boolean }
>(({ noSeparator, className, children }, ref) => {
  const childArr = Children.map(children, (c) => c);
  if (!childArr || childArr.length === 0) return null;

  return (
    <div ref={ref} className={cn('flex', className)}>
      {!noSeparator && (
        <div className="h-full py-1">
          <Separator orientation="vertical" />
        </div>
      )}

      <div className="mx-1 flex items-center gap-1">{children}</div>
    </div>
  );
});
ToolbarGroup.displayName = 'ToolbarGroup';

export {
  Toolbar,
  ToolbarLink,
  ToolbarToggleGroup,
  ToolbarSeparator,
  ToolbarToggleItem,
  ToolbarButton,
  ToolbarGroup,
};
