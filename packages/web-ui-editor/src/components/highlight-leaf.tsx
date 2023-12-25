import { PlateLeaf, PlateLeafProps } from '@udecode/plate-common';

import { cn } from '../lib/utils';

export function HighlightLeaf({ className, children, ...props }: PlateLeafProps) {
  return (
    <PlateLeaf
      asChild
      className={cn('bg-primary/20 dark:bg-primary/40 text-inherit', className)}
      {...props}
    >
      <mark>{children}</mark>
    </PlateLeaf>
  );
}
