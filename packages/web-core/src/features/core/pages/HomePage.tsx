import { AnimatePresence, motion } from 'framer-motion';

import Auth from '../../auth/components/Auth';
import { useAuthUserSetting } from '../../auth/state/authStore';
import Background from '../../background/components/Background';
import BackgroundInformation from '../../background/components/BackgroundInfromation';
import Calendar from '../../calendar/components/Calendar';
import Clock from '../../clock/components/Clock';
import CommandsButton from '../../commands/components/CommandsButton';
import Greeting from '../../greeting/components/Greeting';
import Mood from '../../mood/components/Mood';
import Notes from '../../notes/components/Notes';
import Quote from '../../quote/components/Quote';
import Search from '../../search/components/Search';
import Settings from '../../settings/components/Settings';
import TasksAppButton from '../../tasks/components/TasksAppButton';
import Weather from '../../weather/components/Weather';
import { ErrorBoundary } from '../components/ErrorBoundary';

const animationVariants = {
  initial: { opacity: 0, y: -100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100 },
};

export default function HomePage() {
  const calendarEnabled = useAuthUserSetting('calendarEnabled', false);
  const commandsEnabled = useAuthUserSetting('commandsEnabled', false);
  const commandsSearchButtonEnabled = useAuthUserSetting('commandsSearchButtonEnabled', false);
  const clockEnabled = useAuthUserSetting('clockEnabled', false);
  const weatherEnabled = useAuthUserSetting('weatherEnabled', false);
  const moodEnabled = useAuthUserSetting('moodEnabled', false);
  const greetingEnabled = useAuthUserSetting('greetingEnabled', false);
  const searchEnabled = useAuthUserSetting('searchEnabled', false);
  const quoteEnabled = useAuthUserSetting('quoteEnabled', false);
  const tasksEnabled = useAuthUserSetting('tasksEnabled', false);
  const notesEnabled = useAuthUserSetting('notesEnabled', false);

  return (
    <ErrorBoundary>
      <Auth />
      <Background />
      <motion.div
        key="content"
        className="full-screen flex flex-col"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={animationVariants}
      >
        <div className="flex-shrink-1 flex justify-center p-4">
          <AnimatePresence>
            {commandsEnabled && commandsSearchButtonEnabled && (
              <motion.div
                key="commands"
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
              >
                <CommandsButton />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-grow flex-col items-center justify-center p-4 text-center">
          <AnimatePresence>
            {clockEnabled && (
              <motion.div
                key="clock"
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
                className="mt-12"
              >
                <Clock />
              </motion.div>
            )}
            {greetingEnabled && (
              <motion.div
                key="greeting"
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
                className="mt-8"
              >
                <Greeting />
              </motion.div>
            )}
            {searchEnabled && (
              <motion.div
                key="search"
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
                className="mt-12"
              >
                <Search />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-end justify-between gap-6 p-4 text-center">
          <div className="flex gap-4">
            <BackgroundInformation />
          </div>
          <AnimatePresence>
            {quoteEnabled && (
              <motion.div
                key="quote"
                className="text-right"
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
              >
                <Quote />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-row justify-center gap-4">
          {moodEnabled && (
            <motion.div
              key="mood"
              layout
              initial="initial"
              animate="animate"
              exit="exit"
              variants={animationVariants}
            >
              <Mood />
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
              <Calendar />
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
              <Notes />
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
              <Weather />
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
            <Settings />
          </motion.div>
        </div>
      </motion.div>
    </ErrorBoundary>
  );
}
