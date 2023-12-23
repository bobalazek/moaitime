import { CalendarViewEnum } from '@moaitime/shared-common';

import { useCalendarStore } from '../../../state/calendarStore';

function CalendarPageHeaderTodayButtonText() {
  const { selectedView } = useCalendarStore();

  if (selectedView === CalendarViewEnum.WEEK) {
    return <>This week</>;
  } else if (selectedView === CalendarViewEnum.MONTH) {
    return <>This month</>;
  } else if (selectedView === CalendarViewEnum.YEAR) {
    return <>This year</>;
  }

  return <>Today</>;
}

export default CalendarPageHeaderTodayButtonText;
