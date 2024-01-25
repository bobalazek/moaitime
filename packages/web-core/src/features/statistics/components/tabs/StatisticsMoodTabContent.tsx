import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { useStatisticsMoodQuery } from '../../hooks/StatisticsHooks';
import StatisticsCard from '../statistics-card/StatisticsCard';

const StatisticsMoodTabContent = () => {
  const { isLoading, error, data } = useStatisticsMoodQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data) {
    return <ErrorAlert error={error} />;
  }

  return (
    <div>
      <h3 className="mb-2 text-2xl font-bold">Mood Entries</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <StatisticsCard
          title="Created Today"
          value={data.moodEntriesCreatedTodayCount}
          description="How many did you create today?"
        />
        <StatisticsCard
          title="Created Yesterday"
          value={data.moodEntriesCreatedYesterdayCount}
          description="How many did you create yesterday?"
        />
        <StatisticsCard
          title="Created This Week"
          value={data.moodEntriesCreatedThisWeekCount}
          description="How many did you create this week?"
        />
        <StatisticsCard
          title="Created This Month"
          value={data.moodEntriesCreatedThisMonthCount}
          description="How many did you create this month?"
        />
      </div>
    </div>
  );
};

export default StatisticsMoodTabContent;
