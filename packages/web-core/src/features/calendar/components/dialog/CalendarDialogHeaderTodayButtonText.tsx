import { CalendarViewEnum } from '@moaitime/shared-common';

import { useCalendarStore } from '../../state/calendarStore';

function CalendarDialogHeaderTodayButtonText() {
  const { selectedView } = useCalendarStore();

  if (selectedView === CalendarViewEnum.WEEK) {
    return <>This week</>;
  } else if (selectedView === CalendarViewEnum.MONTH) {
    return <>This month</>;
  } else if (selectedView === CalendarViewEnum.YEAR) {
    return <>This year</>;
  } else if (selectedView === CalendarViewEnum.AGENDA) {
    return <>This quarter</>;
  }

  return <>Today</>;
}

export default CalendarDialogHeaderTodayButtonText;
