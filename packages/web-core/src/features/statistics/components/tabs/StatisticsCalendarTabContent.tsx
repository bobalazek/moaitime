import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { useCalendarStatisticsQuery } from '../../hooks/StatisticsCalendarHooks';
import StatisticsCard from '../statistics-card/StatisticsCard';

const StatisticsCalendarTabContent = () => {
  const { isLoading, error, data } = useCalendarStatisticsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data) {
    return <ErrorAlert error={error} />;
  }

  return (
    <div>
      <h3 className="mb-2 text-2xl font-bold">Events</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <StatisticsCard
          title="Created Today"
          value={data.eventsCreatedTodayCount}
          description="How many did you create today?"
        />
        <StatisticsCard
          title="Created Yesterday"
          value={data.eventsCreatedYesterdayCount}
          description="How many did you create yesterday?"
        />
        <StatisticsCard
          title="Created This Week"
          value={data.eventsCreatedThisWeekCount}
          description="How many did you create this week?"
        />
        <StatisticsCard
          title="Created This Month"
          value={data.eventsCreatedThisMonthCount}
          description="How many did you create this month?"
        />
      </div>
    </div>
  );
};

export default StatisticsCalendarTabContent;
