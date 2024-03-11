// CUSTOM - not a part of original platejs package

import { setMarks, useEditorRef } from '@udecode/plate-common';
import { MARK_FONT_SIZE } from '@udecode/plate-font';

import { DEFAULT_FONT_SIZE } from './font-size-dropdown-menu';
import { ToolbarButton, ToolbarButtonProps } from './toolbar';

export interface FontSizeToolbarButtonProps
  extends Pick<ToolbarButtonProps, 'tooltip' | 'children'> {
  action: 'increase' | 'decrease';
  clear?: string | string[];
}

export function FontSizeToolbarButton({ action, ...props }: FontSizeToolbarButtonProps) {
  const editor = useEditorRef();

  return (
    <ToolbarButton
      onClick={() => {
        const marks = editor.getMarks();
        const value = (marks as { fontSize: number })?.fontSize ?? DEFAULT_FONT_SIZE;
        const newValue = value + (action === 'increase' ? 1 : -1);

        setMarks(editor, { [MARK_FONT_SIZE]: newValue });
      }}
      {...props}
    />
  );
}
