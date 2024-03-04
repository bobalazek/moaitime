import { AnimatePresence, motion } from 'framer-motion';

import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { useHabitsQuery } from '../../hooks/useHabitsQuery';
import HabitEntryActions from '../habit-entry/HabitEntryActions';

const animationVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -100,
  },
};

export default function HabitsSettingsDialogHabits() {
  const { isLoading, error, data } = useHabitsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  if (!data || data.length === 0) {
    return <div className="text-muted-foreground">No habits yet</div>;
  }

  return (
    <div data-test="habits--settings-dialog--habits">
      <AnimatePresence>
        {data.map((habit) => (
          <motion.div
            key={habit.id}
            layout
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animationVariants}
          >
            <div className="flex justify-between">
              <div className="flex w-full justify-between">
                <h5>
                  {habit.name}
                  <div
                    className="ml-2 inline-block h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: habit.color ?? undefined,
                      borderRadius: '50%',
                    }}
                  />
                </h5>
                <HabitEntryActions habit={habit} />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
