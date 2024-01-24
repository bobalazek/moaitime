import { AnimatePresence, motion } from 'framer-motion';

import { ScrollArea, ScrollBar } from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../../auth/state/authStore';
import CalendarAppButton from '../../../calendar/components/CalendarAppButton';
import CommandsAppButton from '../../../commands/components/CommandsAppButton';
import FocusAppButton from '../../../focus/components/FocusAppButton';
import MoodAppButton from '../../../mood/components/MoodAppButton';
import NotesAppButton from '../../../notes/components/NotesAppButton';
import SettingsAppButton from '../../../settings/components/SettingsAppButton';
import StatisticsAppButton from '../../../statistics/components/StatisticsAppButton';
import TasksAppButton from '../../../tasks/components/TasksAppButton';
import WeatherAppButton from '../../../weather/components/WeatherAppButton';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const animationVariants = {
  initial: { opacity: 0, y: -100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100 },
};

const delayDuration = 0.1;

export default function AppsDock() {
  const calendarEnabled = useAuthUserSetting('calendarEnabled', false);
  const commandsEnabled = useAuthUserSetting('commandsEnabled', false);
  const weatherEnabled = useAuthUserSetting('weatherEnabled', false);
  const moodEnabled = useAuthUserSetting('moodEnabled', false);
  const tasksEnabled = useAuthUserSetting('tasksEnabled', false);
  const notesEnabled = useAuthUserSetting('notesEnabled', false);
  const focusEnabled = useAuthUserSetting('focusEnabled', false);

  let delay = 0;

  return (
    <ErrorBoundary>
      <div className="z-50 flex w-full justify-center p-2">
        <ScrollArea>
          <div className="flex flex-row gap-3 rounded-2xl border border-gray-300 bg-white/30 p-2 backdrop-blur-3xl">
            <AnimatePresence>
              {calendarEnabled && (
                <motion.div
                  key="calendar"
                  layout
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={animationVariants}
                  transition={{ delay: delay++ * delayDuration }}
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
                  transition={{ delay: delay++ * delayDuration }}
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
                  transition={{ delay: delay++ * delayDuration }}
                >
                  <NotesAppButton />
                </motion.div>
              )}
              {moodEnabled && (
                <motion.div
                  key="mood"
                  layout
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={animationVariants}
                  transition={{ delay: delay++ * delayDuration }}
                >
                  <MoodAppButton />
                </motion.div>
              )}
              {focusEnabled && (
                <motion.div
                  key="focus"
                  layout
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={animationVariants}
                  transition={{ delay: delay++ * delayDuration }}
                >
                  <FocusAppButton />
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
                  transition={{ delay: delay++ * delayDuration }}
                >
                  <WeatherAppButton />
                </motion.div>
              )}
              {commandsEnabled && (
                <motion.div
                  key="commands"
                  layout
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={animationVariants}
                  transition={{ delay: delay++ * delayDuration }}
                >
                  <CommandsAppButton />
                </motion.div>
              )}
              <motion.div
                key="statistics"
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
                transition={{ delay: delay++ * delayDuration }}
              >
                <StatisticsAppButton />
              </motion.div>
              <motion.div
                key="settings"
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
                transition={{ delay: delay++ * delayDuration }}
              >
                <SettingsAppButton />
              </motion.div>
            </AnimatePresence>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </ErrorBoundary>
  );
}
