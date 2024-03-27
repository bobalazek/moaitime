import { subDays } from 'date-fns';

import { useHabitsStatisticsHabitsCreatedQuery } from '../../../hooks/StatisticsHabitsHooks';
import StatisticsChart from '../../statistics-common/StatisticsChart';

export default function HabitsCreatedSection() {
  const to = new Date();
  const from = subDays(to, 14);

  return (
    <StatisticsChart
      chartId="habits-created"
      chartLabel="Habits"
      heading="Habits Created"
      from={from}
      to={to}
      useStatisticsDataQuery={useHabitsStatisticsHabitsCreatedQuery}
    />
  );
}
