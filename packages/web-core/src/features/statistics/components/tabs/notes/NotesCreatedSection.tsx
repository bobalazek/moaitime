import { subDays } from 'date-fns';

import { useNotesStatisticsNotesCreatedQuery } from '../../../hooks/StatisticsNotesHooks';
import StatisticsChart from '../../statistics-common/StatisticsChart';

export default function NotesCreatedSection() {
  const to = new Date();
  const from = subDays(to, 14);

  return (
    <StatisticsChart
      chartId="notes-created"
      chartLabel="Notes"
      heading="Notes Created"
      from={from}
      to={to}
      useStatisticsDataQuery={useNotesStatisticsNotesCreatedQuery}
    />
  );
}
