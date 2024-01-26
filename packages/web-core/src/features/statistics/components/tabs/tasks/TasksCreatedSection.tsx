import { subDays } from 'date-fns';

import { useTasksStatisticsTasksCreatedQuery } from '../../../hooks/StatisticsTasksHooks';
import StatisticsChart from '../../statistics-common/StatisticsChart';

export default function TasksCreatedSection() {
  const to = new Date();
  const from = subDays(to, 14);

  return (
    <StatisticsChart
      chartId="tasks-created"
      chartLabel="Tasks"
      heading="Tasks Created"
      from={from}
      to={to}
      useStatisticsDataQuery={useTasksStatisticsTasksCreatedQuery}
    />
  );
}
