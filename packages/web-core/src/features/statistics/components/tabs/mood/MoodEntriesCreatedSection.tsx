import { subDays } from 'date-fns';

import { useMoodStatisticsMoodEntriesCreatedQuery } from '../../../hooks/StatisticsMoodHooks';
import StatisticsChart from '../../statistics-common/StatisticsChart';

export default function MoodEntriesCreatedSection() {
  const to = new Date();
  const from = subDays(to, 14);

  return (
    <StatisticsChart
      chartId="mood-entries-created"
      chartLabel="Mood Entries"
      heading="Mood Entries Created"
      from={from}
      to={to}
      useStatisticsDataQuery={useMoodStatisticsMoodEntriesCreatedQuery}
    />
  );
}
