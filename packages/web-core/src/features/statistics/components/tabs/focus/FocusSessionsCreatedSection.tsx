import { subDays } from 'date-fns';

import { useFocusStatisticsFocusSessionsCreatedQuery } from '../../../hooks/StatisticsFocusHooks';
import StatisticsChart from '../../statistics-common/StatisticsChart';

export default function FocusSessionsCreatedSection() {
  const to = new Date();
  const from = subDays(to, 14);

  return (
    <StatisticsChart
      chartId="focus-sessions-created"
      chartLabel="Focus Sessions"
      heading="Focus Sessions Created"
      from={from}
      to={to}
      useStatisticsDataQuery={useFocusStatisticsFocusSessionsCreatedQuery}
    />
  );
}
