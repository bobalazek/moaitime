import { subDays } from 'date-fns';

import StatisticsTasksTabContentBasics from './tasks/StatisticsTasksTabContentBasics';
import StatisticsTasksTabContentDateCountMap from './tasks/StatisticsTasksTabContentDateCountMap';

export default function StatisticsTasksTabContent() {
  const to = new Date();
  const from = subDays(to, 28);

  return (
    <div>
      <h3 className="mb-2 text-2xl font-bold">Tasks</h3>
      <div className="space-y-4">
        <StatisticsTasksTabContentBasics />
        <StatisticsTasksTabContentDateCountMap from={from} to={to} />
      </div>
    </div>
  );
}
