/* eslint-disable @typescript-eslint/no-explicit-any */

import { PlateElement, PlateElementProps, Value } from '@udecode/plate-common';
import { TLinkElement, useLink } from '@udecode/plate-link';
import { forwardRef } from 'react';

import { cn } from '../lib/utils';

const LinkElement = forwardRef<
  React.ElementRef<typeof PlateElement>,
  PlateElementProps<Value, TLinkElement>
>(({ className, children, ...props }, ref) => {
  const { props: linkProps } = useLink({ element: props.element });

  return (
    <PlateElement
      asChild
      ref={ref}
      className={cn(
        'text-primary decoration-primary font-medium underline underline-offset-4',
        className
      )}
      {...linkProps}
      {...(props as any)}
    >
      <a>{children}</a>
    </PlateElement>
  );
});
LinkElement.displayName = 'LinkElement';

export { LinkElement };
