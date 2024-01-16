import { AnimatePresence, motion } from 'framer-motion';

import { useAuthUserSetting } from '../../../auth/state/authStore';
import CalendarAppButton from '../../../calendar/components/CalendarAppButton';
import CommandsAppButton from '../../../commands/components/CommandsAppButton';
import MoodAppButton from '../../../mood/components/MoodAppButton';
import NotesAppButton from '../../../notes/components/NotesAppButton';
import SettingsAppButton from '../../../settings/components/SettingsAppButton';
import TasksAppButton from '../../../tasks/components/TasksAppButton';
import WeatherAppButton from '../../../weather/components/WeatherAppButton';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const animationVariants = {
  initial: { opacity: 0, y: -100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100 },
};

export default function AppsDock() {
  const calendarEnabled = useAuthUserSetting('calendarEnabled', false);
  const commandsEnabled = useAuthUserSetting('commandsEnabled', false);
  const commandsSearchButtonEnabled = useAuthUserSetting('commandsSearchButtonEnabled', false);
  const weatherEnabled = useAuthUserSetting('weatherEnabled', false);
  const moodEnabled = useAuthUserSetting('moodEnabled', false);
  const tasksEnabled = useAuthUserSetting('tasksEnabled', false);
  const notesEnabled = useAuthUserSetting('notesEnabled', false);

  return (
    <ErrorBoundary>
      <div className="flex justify-center p-2">
        <div className="flex flex-row gap-3 rounded-2xl border border-gray-300 bg-white/30 p-2 backdrop-blur-3xl">
          <AnimatePresence>
            {moodEnabled && (
              <motion.div
                key="mood"
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
              >
                <MoodAppButton />
              </motion.div>
            )}
            {calendarEnabled && (
              <motion.div
                key="calendar"
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
              >
                <CalendarAppButton />
              </motion.div>
            )}
            {tasksEnabled && (
              <motion.div
                key="tasks"
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
              >
                <TasksAppButton />
              </motion.div>
            )}
            {notesEnabled && (
              <motion.div
                key="notes"
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
              >
                <NotesAppButton />
              </motion.div>
            )}
            {false && weatherEnabled && (
              <motion.div
                key="weather"
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
              >
                <WeatherAppButton />
              </motion.div>
            )}
            {commandsEnabled && commandsSearchButtonEnabled && (
              <motion.div
                key="commands"
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
              >
                <CommandsAppButton />
              </motion.div>
            )}
            <motion.div
              key="settings"
              layout
              initial="initial"
              animate="animate"
              exit="exit"
              variants={animationVariants}
            >
              <SettingsAppButton />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ErrorBoundary>
  );
}
