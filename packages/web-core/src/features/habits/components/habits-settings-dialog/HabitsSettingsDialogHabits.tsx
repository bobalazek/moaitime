import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { useHabitsStore } from '../../state/habitsStore';
import HabitItem from '../habit-item/HabitItem';

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
  const { habits, reloadHabits } = useHabitsStore();
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;

    reloadHabits();
  }, [reloadHabits]);

  if (habits.length === 0) {
    return <div className="text-muted-foreground">No habits yet</div>;
  }

  return (
    <div data-test="habits--settings-dialog--habits">
      <AnimatePresence>
        {habits.map((habit) => (
          <motion.div
            key={habit.id}
            layout
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animationVariants}
          >
            <HabitItem habit={habit} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
