import { ErrorAlert } from '../../../../core/components/ErrorAlert';
import { Loader } from '../../../../core/components/Loader';
import { useStatisticsTasksQuery } from '../../../hooks/StatisticsHooks';
import StatisticsCard from '../../statistics-card/StatisticsCard';

export default function StatisticsTasksTabContentBasics() {
  const { isLoading, error, data } = useStatisticsTasksQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data) {
    return <ErrorAlert error={error} />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <StatisticsCard
          title="Created Today"
          value={data.tasksCreatedTodayCount}
          description="How many did you create today?"
        />
        <StatisticsCard
          title="Created Yesterday"
          value={data.tasksCreatedYesterdayCount}
          description="How many did you create yesterday?"
        />
        <StatisticsCard
          title="Created This Week"
          value={data.tasksCreatedThisWeekCount}
          description="How many did you create this week?"
        />
        <StatisticsCard
          title="Created This Month"
          value={data.tasksCreatedThisMonthCount}
          description="How many did you create this month?"
        />
      </div>
    </div>
  );
}
