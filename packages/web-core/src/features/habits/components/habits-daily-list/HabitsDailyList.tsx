import { format } from 'date-fns';

import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { useHabitsDailyQuery } from '../../hooks/useHabitsDailyQuery';
import { useHabitsStore } from '../../state/habitsStore';
import HabitDailyEntry from '../habit-daily-entry/HabitDailyEntry';

const HabitsDailyList = () => {
  const { selectedDate } = useHabitsStore();
  const { isLoading, error, data } = useHabitsDailyQuery(format(selectedDate, 'yyyy-MM-dd'));

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data) {
    return <ErrorAlert error={error} />;
  }

  return (
    <div>
      <div data-test="habits-daily-list" className="flex flex-col gap-4">
        {data.map((habitDaily) => (
          <HabitDailyEntry key={habitDaily.id} habitDaily={habitDaily} />
        ))}
      </div>
    </div>
  );
};

export default HabitsDailyList;
