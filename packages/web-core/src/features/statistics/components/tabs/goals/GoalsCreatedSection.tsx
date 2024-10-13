import { subDays } from 'date-fns';

import { useGoalsStatisticsGoalsCreatedQuery } from '../../../hooks/StatisticsGoalsHooks';
import StatisticsChart from '../../statistics-common/StatisticsChart';

export default function GoalsCreatedSection() {
  const to = new Date();
  const from = subDays(to, 14);

  return (
    <StatisticsChart
      chartId="goals-created"
      chartLabel="Goals"
      heading="Goals Created"
      from={from}
      to={to}
      useStatisticsDataQuery={useGoalsStatisticsGoalsCreatedQuery}
    />
  );
}
