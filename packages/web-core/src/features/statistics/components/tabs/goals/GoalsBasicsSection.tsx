import { ErrorAlert } from '../../../../core/components/ErrorAlert';
import { Loader } from '../../../../core/components/Loader';
import { useGoalsStatisticsQuery } from '../../../hooks/StatisticsGoalsHooks';
import StatisticsCard from '../../statistics-common/StatisticsCard';

export default function GoalsBasicsSection() {
  const { isLoading, error, data } = useGoalsStatisticsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data) {
    return <ErrorAlert error={error} />;
  }

  return (
    <div>
      <h3 className="mb-2 text-2xl font-bold">Goals</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <StatisticsCard
          title="Created Today"
          value={data.goalsCreatedTodayCount}
          description="How many did you create today?"
        />
        <StatisticsCard
          title="Created Yesterday"
          value={data.goalsCreatedYesterdayCount}
          description="How many did you create yesterday?"
        />
        <StatisticsCard
          title="Created This Week"
          value={data.goalsCreatedThisWeekCount}
          description="How many did you create this week?"
        />
        <StatisticsCard
          title="Created This Month"
          value={data.goalsCreatedThisMonthCount}
          description="How many did you create this month?"
        />
      </div>
    </div>
  );
}
