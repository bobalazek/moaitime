import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { PopoverAnchor, PopoverContentProps } from '@radix-ui/react-popover';
import {
  isSelectionExpanded,
  PlateElement,
  PlateElementProps,
  useEditorRef,
  useEditorSelector,
  useElement,
  useRemoveNodeButton,
} from '@udecode/plate-common';
import {
  mergeTableCells,
  TTableElement,
  unmergeTableCells,
  useTableBordersDropdownMenuContentState,
  useTableElement,
  useTableElementState,
  useTableMergeState,
} from '@udecode/plate-table';
import React, { forwardRef } from 'react';
import { useReadOnly, useSelected } from 'slate-react';

import { cn } from '../lib/utils';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Icons, iconVariants } from './icons';
import { Popover, PopoverContent, popoverVariants } from './popover';
import { Separator } from './separator';

const TableBordersDropdownMenuContent = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>((props, ref) => {
  const {
    getOnSelectTableBorder,
    hasOuterBorders,
    hasBottomBorder,
    hasLeftBorder,
    hasNoBorders,
    hasRightBorder,
    hasTopBorder,
  } = useTableBordersDropdownMenuContentState();

  return (
    <DropdownMenuContent
      ref={ref}
      className={cn('min-w-[220px]')}
      side="right"
      align="start"
      sideOffset={0}
      {...props}
    >
      <DropdownMenuCheckboxItem
        checked={hasBottomBorder}
        onCheckedChange={getOnSelectTableBorder('bottom')}
      >
        <Icons.borderBottom className={iconVariants({ size: 'sm' })} />
        <div>Bottom Border</div>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={hasTopBorder}
        onCheckedChange={getOnSelectTableBorder('top')}
      >
        <Icons.borderTop className={iconVariants({ size: 'sm' })} />
        <div>Top Border</div>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={hasLeftBorder}
        onCheckedChange={getOnSelectTableBorder('left')}
      >
        <Icons.borderLeft className={iconVariants({ size: 'sm' })} />
        <div>Left Border</div>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={hasRightBorder}
        onCheckedChange={getOnSelectTableBorder('right')}
      >
        <Icons.borderRight className={iconVariants({ size: 'sm' })} />
        <div>Right Border</div>
      </DropdownMenuCheckboxItem>

      <Separator />

      <DropdownMenuCheckboxItem
        checked={hasNoBorders}
        onCheckedChange={getOnSelectTableBorder('none')}
      >
        <Icons.borderNone className={iconVariants({ size: 'sm' })} />
        <div>No Border</div>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={hasOuterBorders}
        onCheckedChange={getOnSelectTableBorder('outer')}
      >
        <Icons.borderAll className={iconVariants({ size: 'sm' })} />
        <div>Outside Borders</div>
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  );
});
TableBordersDropdownMenuContent.displayName = 'TableBordersDropdownMenuContent';

const TableFloatingToolbar = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  PopoverContentProps
>(({ children, ...props }, ref) => {
  const element = useElement<TTableElement>();
  const { props: buttonProps } = useRemoveNodeButton({ element });

  const selectionCollapsed = useEditorSelector((editor) => !isSelectionExpanded(editor), []);

  const readOnly = useReadOnly();
  const selected = useSelected();
  const editor = useEditorRef();

  const collapsed = !readOnly && selected && selectionCollapsed;
  const open = !readOnly && selected;

  const { canMerge, canUnmerge } = useTableMergeState();

  const mergeContent = canMerge && (
    <Button contentEditable={false} variant="ghost" isMenu onClick={() => mergeTableCells(editor)}>
      <Icons.combine className="mr-2 h-4 w-4" />
      Merge
    </Button>
  );

  const unmergeButton = canUnmerge && (
    <Button
      contentEditable={false}
      variant="ghost"
      isMenu
      onClick={() => unmergeTableCells(editor)}
    >
      <Icons.ungroup className="mr-2 h-4 w-4" />
      Unmerge
    </Button>
  );

  const bordersContent = collapsed && (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" isMenu>
            <Icons.borderAll className="mr-2 h-4 w-4" />
            Borders
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <TableBordersDropdownMenuContent />
        </DropdownMenuPortal>
      </DropdownMenu>

      <Button contentEditable={false} variant="ghost" isMenu {...buttonProps}>
        <Icons.delete className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </>
  );

  return (
    <Popover open={open} modal={false}>
      <PopoverAnchor asChild>{children}</PopoverAnchor>
      {(canMerge || canUnmerge || collapsed) && (
        <PopoverContent
          ref={ref}
          className={cn(popoverVariants(), 'flex w-[220px] flex-col gap-1 p-1')}
          onOpenAutoFocus={(e) => e.preventDefault()}
          {...props}
        >
          {unmergeButton}
          {mergeContent}
          {bordersContent}
        </PopoverContent>
      )}
    </Popover>
  );
});
TableFloatingToolbar.displayName = 'TableFloatingToolbar';

const TableElement = React.forwardRef<React.ElementRef<typeof PlateElement>, PlateElementProps>(
  ({ className, children, ...props }, ref) => {
    const { colSizes, isSelectingCell, minColumnWidth, marginLeft } = useTableElementState();
    const { props: tableProps, colGroupProps } = useTableElement();

    return (
      <TableFloatingToolbar>
        <div style={{ paddingLeft: marginLeft }}>
          <PlateElement
            asChild
            ref={ref}
            className={cn(
              'my-4 ml-px mr-0 table h-px w-full table-fixed border-collapse',
              isSelectingCell && '[&_*::selection]:bg-none',
              className
            )}
            {...tableProps}
            {...props}
          >
            <table>
              <colgroup {...colGroupProps}>
                {colSizes.map((width, index) => (
                  <col
                    key={index}
                    style={{
                      minWidth: minColumnWidth,
                      width: width || undefined,
                    }}
                  />
                ))}
              </colgroup>

              <tbody className="min-w-full">{children}</tbody>
            </table>
          </PlateElement>
        </div>
      </TableFloatingToolbar>
    );
  }
);
TableElement.displayName = 'TableElement';

export { TableElement, TableFloatingToolbar, TableBordersDropdownMenuContent };
