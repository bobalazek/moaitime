import { getHandler, PlateElement, PlateElementProps, Value } from '@udecode/plate-common';
import { TMentionElement } from '@udecode/plate-mention';
import { forwardRef } from 'react';
import { useFocused, useSelected } from 'slate-react';

import { cn } from '../lib/utils';

export interface MentionInputElementProps extends PlateElementProps<Value, TMentionElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (mentionNode: any) => void;
}

const MentionInputElement = forwardRef<
  React.ElementRef<typeof PlateElement>,
  MentionInputElementProps
>(({ className, onClick, ...props }, ref) => {
  const { children, element } = props;

  const selected = useSelected();
  const focused = useFocused();

  return (
    <PlateElement
      asChild
      ref={ref}
      data-slate-value={element.value}
      className={cn(
        'bg-muted inline-block rounded-md px-1.5 py-0.5 align-baseline text-sm',
        selected && focused && 'ring-ring ring-2',
        className
      )}
      onClick={getHandler(onClick, element)}
      {...props}
    >
      <span>{children}</span>
    </PlateElement>
  );
});
MentionInputElement.displayName = 'MentionInputElement';

export { MentionInputElement };
