import { motion } from 'framer-motion';

import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { useGoalsQuery } from '../../hooks/useGoalsDailyQuery';
import GoalEntry from '../goal-entry/GoalEntry';

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

const GoalsList = () => {
  const { isLoading, error, data } = useGoalsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data) {
    return <ErrorAlert error={error} />;
  }

  return (
    <div>
      <div data-test="goals-list">
        {data.length === 0 && (
          <div className="text-muted-foreground justify-center text-center">
            <div className="mb-3 text-3xl">No goals just yet.</div>
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
            {data.map((goal) => (
              <motion.div
                key={goal.id}
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
              >
                <GoalEntry goal={goal} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsList;
