import Chart from 'react-apexcharts';

import { ErrorAlert } from '../../../../core/components/ErrorAlert';
import { Loader } from '../../../../core/components/Loader';
import { useTasksStatisticsTasksCreatedQuery } from '../../../hooks/StatisticsHooks';

export default function StatisticsTasksTabContentDateCountMap({
  from,
  to,
}: {
  from: Date;
  to: Date;
}) {
  const { isLoading, error, data } = useTasksStatisticsTasksCreatedQuery({ from, to });

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data) {
    return <ErrorAlert error={error} />;
  }

  const dates = Object.keys(data).map((date) => new Date(date).toLocaleDateString());
  const counts = Object.values(data);

  return (
    <div>
      <h4 className="mb-2 text-lg font-bold">Tasks Created by Day</h4>
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
    </div>
  );
}
