import {
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
} from '@udecode/plate-basic-marks';
import { useEditorReadOnly } from '@udecode/plate-common';
import { MARK_BG_COLOR, MARK_COLOR } from '@udecode/plate-font';
import { ELEMENT_OL, ELEMENT_UL } from '@udecode/plate-list';

import { AlignDropdownMenu } from './align-dropdown-menu';
import { ColorDropdownMenu } from './color-dropdown-menu';
import { EmojiDropdownMenu } from './emoji-dropdown-menu';
import { FontSizeToolbarButton } from './font-size-toolbar-button';
import { Icons, iconVariants } from './icons';
import { IndentToolbarButton } from './indent-toolbar-button';
import { InsertDropdownMenu } from './insert-dropdown-menu';
import { LineHeightDropdownMenu } from './line-height-dropdown-menu';
import { LinkToolbarButton } from './link-toolbar-button';
import { ListToolbarButton } from './list-toolbar-button';
import { MarkToolbarButton } from './mark-toolbar-button';
import { MediaToolbarButton } from './media-toolbar-button';
import { ModeDropdownMenu } from './mode-dropdown-menu';
import { OutdentToolbarButton } from './outdent-toolbar-button';
import { TableDropdownMenu } from './table-dropdown-menu';
import { ToolbarGroup } from './toolbar';
import { TurnIntoDropdownMenu } from './turn-into-dropdown-menu';

export function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();

  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex flex-wrap"
        style={{
          transform: 'translateX(calc(-1px))',
        }}
      >
        {!readOnly && (
          <>
            <ToolbarGroup noSeparator>
              <InsertDropdownMenu />
              <TurnIntoDropdownMenu />
            </ToolbarGroup>
            <ToolbarGroup>
              <FontSizeToolbarButton tooltip="Increase font size" action="increase">
                <Icons.add />
              </FontSizeToolbarButton>
              <FontSizeToolbarButton tooltip="Decrease font size" action="decrease">
                <Icons.minus />
              </FontSizeToolbarButton>
            </ToolbarGroup>
            <ToolbarGroup>
              <MarkToolbarButton tooltip="Bold (⌘+B)" nodeType={MARK_BOLD}>
                <Icons.bold />
              </MarkToolbarButton>
              <MarkToolbarButton tooltip="Italic (⌘+I)" nodeType={MARK_ITALIC}>
                <Icons.italic />
              </MarkToolbarButton>
              <MarkToolbarButton tooltip="Underline (⌘+U)" nodeType={MARK_UNDERLINE}>
                <Icons.underline />
              </MarkToolbarButton>
              <MarkToolbarButton tooltip="Strikethrough (⌘+⇧+M)" nodeType={MARK_STRIKETHROUGH}>
                <Icons.strikethrough />
              </MarkToolbarButton>
              <MarkToolbarButton tooltip="Code (⌘+E)" nodeType={MARK_CODE}>
                <Icons.code />
              </MarkToolbarButton>
            </ToolbarGroup>
            <ToolbarGroup>
              <ColorDropdownMenu nodeType={MARK_COLOR} tooltip="Text Color">
                <Icons.color className={iconVariants({ variant: 'toolbar' })} />
              </ColorDropdownMenu>
              <ColorDropdownMenu nodeType={MARK_BG_COLOR} tooltip="Highlight Color">
                <Icons.bg className={iconVariants({ variant: 'toolbar' })} />
              </ColorDropdownMenu>
            </ToolbarGroup>
            <ToolbarGroup>
              <AlignDropdownMenu />
              <LineHeightDropdownMenu />
              <ListToolbarButton nodeType={ELEMENT_UL} />
              <ListToolbarButton nodeType={ELEMENT_OL} />
              <TableDropdownMenu />
              <IndentToolbarButton />
              <OutdentToolbarButton />
            </ToolbarGroup>
            <ToolbarGroup>
              <LinkToolbarButton />
              <MediaToolbarButton />
              <EmojiDropdownMenu />
            </ToolbarGroup>
          </>
        )}

        <div className="grow" />

        <ToolbarGroup noSeparator>
          <ModeDropdownMenu />
        </ToolbarGroup>
      </div>
    </div>
  );
}
