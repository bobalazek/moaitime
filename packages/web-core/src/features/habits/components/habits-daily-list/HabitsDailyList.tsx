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
      <div data-test="habits-daily-list">
        {data.length === 0 && (
          <div className="text-muted-foreground justify-center text-center">
            <div className="mb-3 text-3xl">No habits just yet.</div>
            <div>
              Would be nice to add at least one, so this page wouldn't be so empty, wouldn't it?
            </div>
            <div className="absolute right-4 top-14 select-none text-center text-5xl">
              <div>☝️</div>
              <div className="mt-2 text-[0.65rem] leading-tight">
                Press here. <br /> Gently please.
              </div>
            </div>
          </div>
        )}
        {data.length > 0 && (
          <div className="flex flex-col gap-4">
            {data.map((habitDaily) => (
              <HabitDailyEntry key={habitDaily.id} habitDaily={habitDaily} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitsDailyList;
