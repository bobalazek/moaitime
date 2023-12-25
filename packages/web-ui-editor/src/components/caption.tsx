import {
  Caption as CaptionPrimitive,
  CaptionTextarea as CaptionTextareaPrimitive,
} from '@udecode/plate-caption';
import { cva, VariantProps } from 'class-variance-authority';
import { ComponentProps, forwardRef } from 'react';

import { cn } from '../lib/utils';

const captionVariants = cva('max-w-full', {
  variants: {
    align: {
      left: 'mr-auto',
      center: 'mx-auto',
      right: 'ml-auto',
    },
  },
  defaultVariants: {
    align: 'center',
  },
});

const Caption = forwardRef<
  React.ElementRef<typeof CaptionPrimitive>,
  ComponentProps<typeof CaptionPrimitive> & VariantProps<typeof captionVariants>
>(({ className, align, ...props }, ref) => (
  <CaptionPrimitive ref={ref} className={cn(captionVariants({ align }), className)} {...props} />
));
Caption.displayName = 'Caption';

const CaptionTextarea = forwardRef<
  React.ElementRef<typeof CaptionTextareaPrimitive>,
  ComponentProps<typeof CaptionTextareaPrimitive>
>(({ className, ...props }, ref) => (
  <CaptionTextareaPrimitive
    ref={ref}
    className={cn(
      'mt-2 w-full resize-none border-none bg-inherit p-0 font-[inherit] text-inherit',
      'focus:outline-none focus:[&::placeholder]:opacity-0',
      'text-center print:placeholder:text-transparent',
      className
    )}
    {...props}
  />
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
)) as any;
CaptionTextarea.displayName = 'CaptionTextarea';

export { Caption, CaptionTextarea };
