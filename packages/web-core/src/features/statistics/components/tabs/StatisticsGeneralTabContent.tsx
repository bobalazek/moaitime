import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { useStatisticsGeneralQuery } from '../../hooks/StatisticsHooks';
import StatisticsCard from '../statistics-card/StatisticsCard';

const StatisticsGeneralTabContent = () => {
  const { isLoading, error, data } = useStatisticsGeneralQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data) {
    return <ErrorAlert error={error} />;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatisticsCard
        title="Lists"
        value={data.listsCountTotal}
        description="The number of lists you created in total"
      />
      <StatisticsCard
        title="Tasks"
        value={data.tasksCountTotal}
        description="The number of tasks you created in total"
      />
      <StatisticsCard
        title="Tags"
        value={data.tagsCountTotal}
        description="The number of tags you created in total"
      />
      <StatisticsCard
        title="Notes"
        value={data.notesCountTotal}
        description="The number of notes you created in total"
      />
      <StatisticsCard
        title="Calendars"
        value={data.calendarsCountTotal}
        description="The number of calendars you created in total"
      />
      <StatisticsCard
        title="Events"
        value={data.eventsCountTotal}
        description="The number of events you created in total"
      />
      <StatisticsCard
        title="Mood Entries"
        value={data.moodEntriesCountTotal}
        description="The number of mood entries you created in total"
      />
      <StatisticsCard
        title="Focus Sessions"
        value={data.focusSessionsCountTotal}
        description="The number of focus sessions you created in total"
      />
    </div>
  );
};

export default StatisticsGeneralTabContent;
