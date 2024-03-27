import { ErrorAlert } from '../../../../core/components/ErrorAlert';
import { Loader } from '../../../../core/components/Loader';
import { useHabitsStatisticsQuery } from '../../../hooks/StatisticsHabitsHooks';
import StatisticsCard from '../../statistics-common/StatisticsCard';

export default function HabitsBasicsSection() {
  const { isLoading, error, data } = useHabitsStatisticsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data) {
    return <ErrorAlert error={error} />;
  }

  return (
    <div>
      <h3 className="mb-2 text-2xl font-bold">Habits</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <StatisticsCard
          title="Created Today"
          value={data.habitsCreatedTodayCount}
          description="How many did you create today?"
        />
        <StatisticsCard
          title="Created Yesterday"
          value={data.habitsCreatedYesterdayCount}
          description="How many did you create yesterday?"
        />
        <StatisticsCard
          title="Created This Week"
          value={data.habitsCreatedThisWeekCount}
          description="How many did you create this week?"
        />
        <StatisticsCard
          title="Created This Month"
          value={data.habitsCreatedThisMonthCount}
          description="How many did you create this month?"
        />
      </div>
    </div>
  );
}
