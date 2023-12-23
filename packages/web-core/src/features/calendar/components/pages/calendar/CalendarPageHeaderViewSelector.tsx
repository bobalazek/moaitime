import { clsx } from 'clsx';
import { FaCaretDown } from 'react-icons/fa';

import { CalendarViewEnum, calendarViewOptions } from '@moaitime/shared-common';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@moaitime/web-ui';

import { useCalendarStore } from '../../../state/calendarStore';

export default function CalendarPageHeaderViewSelector() {
  const { selectedView, setSelectedView } = useCalendarStore();

  const calendarViewOption = calendarViewOptions.find((option) => option.value === selectedView);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          data-test="calendar--header--view-selector--dropdown-menu--trigger-button"
        >
          <span className="mr-2 inline-block">{calendarViewOption?.label ?? selectedView}</span>
          <FaCaretDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" data-test="calendar--header--view-selector--dropdown-menu">
        <DropdownMenuRadioGroup
          value={selectedView}
          onValueChange={(value) => {
            setSelectedView(value as CalendarViewEnum);
          }}
        >
          {calendarViewOptions.map((calendarViewOption) => (
            <DropdownMenuRadioItem
              key={calendarViewOption.value}
              className={clsx('cursor-pointer', calendarViewOption.className)}
              value={calendarViewOption.value}
            >
              {calendarViewOption.label}
              <DropdownMenuShortcut>
                {calendarViewOption.keyboardShortcutKey.toUpperCase()}
              </DropdownMenuShortcut>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
