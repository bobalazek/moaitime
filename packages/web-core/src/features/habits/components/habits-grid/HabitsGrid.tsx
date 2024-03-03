import { AnimatePresence, motion } from 'framer-motion';

import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { useHabitsQuery } from '../../../habits/hooks/useHabitsQuery';

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
            className="flex flex-col gap-3 rounded-lg border-2 p-3"
            data-test="habits--habit-grid--habit"
          >
            <div className="flex justify-between">
              <h5 className="text-lg">
                <span className="font-bold">{habit.name}</span>
              </h5>
            </div>
            <div className="text-muted-foreground text-sm">{habit.description}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
