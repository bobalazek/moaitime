import {
  createNodeHOC,
  createNodesHOC,
  PlaceholderProps,
  usePlaceholderState,
} from '@udecode/plate-common';
import { ELEMENT_H1 } from '@udecode/plate-heading';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { Children, cloneElement } from 'react';

import { cn } from '../lib/utils';

export const Placeholder = (props: PlaceholderProps) => {
  const { children, placeholder, nodeProps } = props;

  const { enabled } = usePlaceholderState(props);

  return Children.map(children, (child) => {
    return cloneElement(child, {
      className: child.props.className,
      nodeProps: {
        ...nodeProps,
        className: cn(
          enabled &&
            'before:absolute before:cursor-text before:opacity-30 before:content-[attr(placeholder)]'
        ),
        placeholder,
      },
    });
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withPlaceholder = createNodeHOC(Placeholder) as any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withPlaceholdersPrimitive = createNodesHOC(Placeholder) as any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withPlaceholders = (components: any) =>
  withPlaceholdersPrimitive(components, [
    {
      key: ELEMENT_PARAGRAPH,
      placeholder: 'Type a paragraph',
      hideOnBlur: true,
      query: {
        maxLevel: 1,
      },
    },
    {
      key: ELEMENT_H1,
      placeholder: 'Untitled',
      hideOnBlur: false,
    },
  ]);
