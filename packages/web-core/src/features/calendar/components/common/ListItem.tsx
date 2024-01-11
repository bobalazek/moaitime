import { colord } from 'colord';

import { List } from '@moaitime/shared-common';
import { Checkbox } from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../../auth/state/authStore';
import { useListsStore } from '../../../tasks/state/listsStore';

export interface CalendarSettingsSheetListItemProps {
  list: List;
  hideCheckbox?: boolean;
}

export default function ListItem({ list, hideCheckbox }: CalendarSettingsSheetListItemProps) {
  const { addVisibleList, removeVisibleList } = useListsStore();

  const visibleListIds = useAuthUserSetting('calendarVisibleListIds', [] as string[]);

  const isChecked = visibleListIds.includes('*') || visibleListIds.includes(list.id);

  const onCheckedChange = async () => {
    if (isChecked) {
      await removeVisibleList(list.id);

      return;
    }

    await addVisibleList(list.id);
  };

  const checkboxBackgroundColor = list.color ?? '';
  const checkboxColor = checkboxBackgroundColor
    ? colord(checkboxBackgroundColor).isDark()
      ? 'white'
      : 'black'
    : '';

  return (
    <div
      className="min-h-[2rem] rounded-lg p-1 outline-none hover:bg-gray-50 dark:hover:bg-gray-800"
      data-test="calendar--list-item"
      data-list-id={list.id}
    >
      <div className="relative h-full w-full">
        {!hideCheckbox && (
          <Checkbox
            className="absolute left-0 top-1"
            checked={isChecked}
            onCheckedChange={onCheckedChange}
            style={{
              backgroundColor: checkboxBackgroundColor,
              color: checkboxColor,
            }}
            data-test="calendar--list-item--visible-checkbox"
          />
        )}
        <div className="break-words px-6" data-test="calendar--list-item--name">
          {list.name}
        </div>
      </div>
    </div>
  );
}
