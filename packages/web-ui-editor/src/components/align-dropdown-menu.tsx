import { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';
import { useAlignDropdownMenu, useAlignDropdownMenuState } from '@udecode/plate-alignment';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  useOpenState,
} from './dropdown-menu';
import { Icons, iconVariants } from './icons';
import { ToolbarButton } from './toolbar';

const items = [
  {
    value: 'left',
    icon: Icons.alignLeft,
  },
  {
    value: 'center',
    icon: Icons.alignCenter,
  },
  {
    value: 'right',
    icon: Icons.alignRight,
  },
  {
    value: 'justify',
    icon: Icons.alignJustify,
  },
];

export interface AlignDropdownMenuProps extends DropdownMenuProps {}

export function AlignDropdownMenu(props: AlignDropdownMenuProps) {
  const state = useAlignDropdownMenuState();
  const { radioGroupProps } = useAlignDropdownMenu(state);

  const openState = useOpenState();
  const IconValue =
    items.find((item) => item.value === radioGroupProps.value)?.icon ?? Icons.alignLeft;

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={openState.open} tooltip="Align" isDropdown>
          <IconValue />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-0">
        <DropdownMenuRadioGroup className="flex flex-col gap-0.5" {...radioGroupProps}>
          {items.map(({ value: itemValue, icon: Icon }) => (
            <DropdownMenuRadioItem key={itemValue} value={itemValue} hideIcon>
              <Icon className={iconVariants({ variant: 'toolbar' })} />
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
