import { subDays } from 'date-fns';

import { useCalendarStatisticsEventsCreatedQuery } from '../../../hooks/StatisticsCalendarHooks';
import StatisticsChart from '../../statistics-common/StatisticsChart';

export default function EventsCreatedSection() {
  const to = new Date();
  const from = subDays(to, 14);

  return (
    <StatisticsChart
      chartId="events-created"
      chartLabel="Events"
      heading="Events Created"
      from={from}
      to={to}
      useStatisticsDataQuery={useCalendarStatisticsEventsCreatedQuery}
    />
  );
}
