import Chart from 'react-apexcharts';

import { ErrorAlert } from '../../../../core/components/ErrorAlert';
import { Loader } from '../../../../core/components/Loader';
import { useStatisticsTasksDateCountMapQuery } from '../../../hooks/StatisticsHooks';
import { padDataForRangeMap } from '../../../utils/StatisticsHelpers';

export default function StatisticsTasksTabContentDateCountMap({
  from,
  to,
}: {
  from: Date;
  to: Date;
}) {
  const { isLoading, error, data } = useStatisticsTasksDateCountMapQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data) {
    return <ErrorAlert error={error} />;
  }

  const finalData = padDataForRangeMap(data, from, to);
  const dates = Object.keys(finalData).map((date) => new Date(date).toLocaleDateString());
  const counts = Object.values(finalData);

  return (
    <Chart
      options={{
        chart: {
          id: 'tasks-chart',
          toolbar: {
            show: false,
          },
        },
        xaxis: {
          categories: dates,
        },
        dataLabels: {
          enabled: false,
        },
      }}
      series={[
        {
          name: 'Tasks',
          data: counts,
        },
      ]}
      type="bar"
      height={350}
    />
  );
}
