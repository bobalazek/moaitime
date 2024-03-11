// CUSTOM - not a part of original platejs package

import { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';
import { setMarks, useEditorRef, useEditorSelection } from '@udecode/plate-common';
import { MARK_FONT_SIZE } from '@udecode/plate-font';
import { useEffect, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  useOpenState,
} from './dropdown-menu';
import { ToolbarButton } from './toolbar';

const values = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72];

export const DEFAULT_FONT_SIZE = 16;

export function FontSizeDropdownMenu({ ...props }: DropdownMenuProps) {
  const openState = useOpenState();
  const editor = useEditorRef();
  const selection = useEditorSelection(editor.id);
  const [value, setValue] = useState(DEFAULT_FONT_SIZE);

  useEffect(() => {
    const marks = editor.getMarks();
    const newValue = (marks as { fontSize: number })?.fontSize;

    if (newValue) {
      setValue(newValue);
    }
  }, [editor, selection]);

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={openState.open} tooltip="Font size" isDropdown>
          {value}
        </ToolbarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-0">
        <DropdownMenuRadioGroup className="flex flex-col gap-0.5">
          {values.map((_value) => (
            <DropdownMenuRadioItem
              key={_value}
              value={_value.toString()}
              onClick={() => {
                setMarks(editor, { [MARK_FONT_SIZE]: _value });
              }}
            >
              {_value}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
