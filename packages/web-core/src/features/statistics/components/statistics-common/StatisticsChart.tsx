import { UseQueryResult } from '@tanstack/react-query';
import Chart from 'react-apexcharts';

import { StatisticsDateCountData } from '@moaitime/shared-common';

import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';

type UseTasksStatisticsDataQuery = (args: {
  from?: Date;
  to?: Date;
}) => UseQueryResult<StatisticsDateCountData, Error>;

export default function StatisticsChart({
  chartId,
  chartLabel,
  heading,
  from,
  to,
  useStatisticsDataQuery,
}: {
  chartId: string;
  chartLabel: string;
  heading: string;
  from: Date;
  to: Date;
  useStatisticsDataQuery: UseTasksStatisticsDataQuery;
}) {
  const { isLoading, error, data } = useStatisticsDataQuery({ from, to });

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
      <h4 className="mb-2 text-lg font-bold">{heading}</h4>
      <Chart
        options={{
          theme: {
            mode: document.body.classList.contains('dark') ? 'dark' : 'light',
          },
          chart: {
            id: chartId,
            toolbar: {
              show: false,
            },
            background: 'transparent',
          },
          xaxis: {
            categories: dates,
          },
          yaxis: {
            forceNiceScale: true,
            decimalsInFloat: 0,
            labels: {
              formatter: (value) => {
                const roundedValue = Math.round(value);
                if (value !== roundedValue) {
                  return '';
                }

                return roundedValue.toString();
              },
            },
          },
          dataLabels: {
            enabled: false,
          },
        }}
        series={[
          {
            name: chartLabel,
            data: counts,
          },
        ]}
        type="bar"
        height={350}
      />
    </div>
  );
}
