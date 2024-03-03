import { AnimatePresence, motion } from 'framer-motion';

import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { useHabitsQuery } from '../../../habits/hooks/useHabitsQuery';
import HabitEntry from '../habit-entry/HabitEntry';

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

export default function HabitsGrid() {
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
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      data-test="habits--habits-grid"
    >
      <AnimatePresence>
        {data.map((habit) => (
          <motion.div
            key={habit.id}
            layout
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animationVariants}
            className="flex flex-col gap-3"
          >
            <HabitEntry habit={habit} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
