import type { PlateContentProps } from '@udecode/plate-common';
import type { VariantProps } from 'class-variance-authority';

import { PlateContent } from '@udecode/plate-common';
import { cva } from 'class-variance-authority';
import { forwardRef } from 'react';

import { cn } from '../lib/utils';

const editorVariants = cva(
  cn(
    'relative overflow-x-auto whitespace-pre-wrap break-words',
    'bg-background ring-offset-background placeholder:text-muted-foreground min-h-[80px] w-full rounded-md px-6 py-4 text-sm focus-visible:outline-none',
    '[&_[data-slate-placeholder]]:text-muted-foreground [&_[data-slate-placeholder]]:!opacity-100',
    '[&_[data-slate-placeholder]]:top-[auto_!important]',
    '[&_strong]:font-bold'
  ),
  {
    variants: {
      variant: {
        outline: 'border-input border',
        ghost: '',
      },
      focused: {
        true: 'ring-ring ring-2 ring-offset-2',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50',
      },
      focusRing: {
        true: 'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2',
        false: '',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'outline',
      focusRing: true,
      size: 'sm',
    },
  }
);

export type EditorProps = PlateContentProps & VariantProps<typeof editorVariants>;

const Editor = forwardRef<HTMLDivElement, EditorProps>(
  ({ className, disabled, focused, focusRing, readOnly, size, variant, ...props }, ref) => {
    return (
      <div ref={ref} className="relative w-full">
        <PlateContent
          className={cn(
            editorVariants({
              disabled,
              focused,
              focusRing,
              size,
              variant,
            }),
            className
          )}
          disableDefaultStyles
          readOnly={disabled ?? readOnly}
          aria-disabled={disabled}
          {...props}
        />
      </div>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) as any;
Editor.displayName = 'Editor';

export { Editor };
