import { subDays } from 'date-fns';

import StatisticsTasksTabContentBasics from './tasks/StatisticsTasksTabContentBasics';
import StatisticsTasksTabContentDateCountMap from './tasks/StatisticsTasksTabContentDateCountMap';

export default function StatisticsTasksTabContent() {
  const to = new Date();
  const from = subDays(to, 14);

  return (
    <div className="space-y-4">
      <StatisticsTasksTabContentBasics />
      <StatisticsTasksTabContentDateCountMap from={from} to={to} />
    </div>
  );
}
