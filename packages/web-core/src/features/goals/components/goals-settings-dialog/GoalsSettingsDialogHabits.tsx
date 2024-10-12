import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

import { useGoalsStore } from '../../state/goalsStore';
import GoalItem from '../goal-item/GoalItem';

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

export default function GoalsSettingsDialogGoals() {
  const { goals, reloadGoals } = useGoalsStore();

  useEffect(() => {
    reloadGoals();
  }, [reloadGoals]);

  if (goals.length === 0) {
    return <div className="text-muted-foreground">No goals yet</div>;
  }

  return (
    <div data-test="goals--settings-dialog--goals">
      <AnimatePresence>
        {goals.map((goal) => (
          <motion.div
            key={goal.id}
            layout
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animationVariants}
          >
            <GoalItem goal={goal} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
