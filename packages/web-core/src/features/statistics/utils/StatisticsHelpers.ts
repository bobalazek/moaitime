import { addDays, format } from 'date-fns';

import { StatisticsDateCountData } from '@moaitime/shared-common';

export const padDataForRangeMap = (data: StatisticsDateCountData, from: Date, to: Date) => {
  const map: StatisticsDateCountData = {};
  const range: Date[] = [];

  let date = from;
  while (date <= to) {
    range.push(date);
    date = addDays(date, 1);
  }

  for (const date of range) {
    const key = format(date, 'yyyy-MM-dd');

    map[key] = data[key] || 0;
  }

  return map;
};
