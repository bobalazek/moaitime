import {
  BrainCircuitIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ListChecksIcon,
  ListIcon,
  NotebookPenIcon,
  SmileIcon,
  TagsIcon,
} from 'lucide-react';

import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { useGeneralStatisticsQuery } from '../../hooks/StatisticsHooks';
import StatisticsCard from '../statistics-card/StatisticsCard';

const StatisticsGeneralTabContent = () => {
  const { isLoading, error, data } = useGeneralStatisticsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data) {
    return <ErrorAlert error={error} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <StatisticsCard
        title="Tasks"
        value={data.tasksCountTotal}
        icon={ListChecksIcon}
        description="The number of tasks you created in total"
      />
      <StatisticsCard
        title="Lists"
        value={data.listsCountTotal}
        icon={ListIcon}
        description="The number of lists you created in total"
      />
      <StatisticsCard
        title="Tags"
        value={data.tagsCountTotal}
        icon={TagsIcon}
        description="The number of tags you created in total"
      />
      <StatisticsCard
        title="Notes"
        value={data.notesCountTotal}
        icon={NotebookPenIcon}
        description="The number of notes you created in total"
      />
      <StatisticsCard
        title="Calendars"
        value={data.calendarsCountTotal}
        icon={CalendarIcon}
        description="The number of calendars you created in total"
      />
      <StatisticsCard
        title="Events"
        value={data.eventsCountTotal}
        icon={CalendarDaysIcon}
        description="The number of events you created in total"
      />
      <StatisticsCard
        title="Mood Entries"
        value={data.moodEntriesCountTotal}
        icon={SmileIcon}
        description="The number of mood entries you created in total"
      />
      <StatisticsCard
        title="Focus Sessions"
        value={data.focusSessionsCountTotal}
        icon={BrainCircuitIcon}
        description="The number of focus sessions you created in total"
      />
    </div>
  );
};

export default StatisticsGeneralTabContent;
