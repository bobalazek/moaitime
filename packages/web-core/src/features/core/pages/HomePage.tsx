import { AnimatePresence, motion } from 'framer-motion';

import Background from '../../background/components/Background';
import BackgroundInformation from '../../background/components/BackgroundInfromation';
import Calendar from '../../calendar/components/Calendar';
import Clock from '../../clock/components/Clock';
import CommandsButton from '../../commands/components/CommandsButton';
import CommandsDialog from '../../commands/components/CommandsDialog';
import Greeting from '../../greeting/components/Greeting';
import Quote from '../../quote/components/Quote';
import Search from '../../search/components/Search';
import Settings from '../../settings/components/Settings';
import { useSettingsStore } from '../../settings/state/settingsStore';
import Tasks from '../../tasks/components/Tasks';
import Weather from '../../weather/components/Weather';
import { ErrorBoundary } from '../components/ErrorBoundary';

const animationVariants = {
  initial: { opacity: 0, y: -100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100 },
};

export default function HomePage() {
  const { settings } = useSettingsStore();

  return (
    <ErrorBoundary>
      <Background />
      <motion.div
        key="content"
        className="full-screen flex flex-col"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={animationVariants}
      >
        <div className="flex-shrink-1 flex justify-between p-4">
          <AnimatePresence>
            {settings.calendarEnabled && (
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
            {settings.commandsEnabled && settings.commandsSearchButtonEnabled && (
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
            {settings.weatherEnabled && (
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
          </AnimatePresence>
        </div>
        <div className="flex flex-grow flex-col items-center justify-center p-4 text-center">
          <AnimatePresence>
            {settings.clockEnabled && (
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
            {settings.greetingEnabled && (
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
            {settings.searchEnabled && (
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
            <Settings />
            <BackgroundInformation />
          </div>
          <AnimatePresence>
            {settings.quoteEnabled && (
              <motion.div
                key="quote"
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
                className="mt-12"
              >
                <Quote />
              </motion.div>
            )}
            {settings.tasksEnabled && (
              <motion.div
                key="tasks"
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
                className="mt-12"
              >
                <Tasks />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      {settings.commandsEnabled && <CommandsDialog />}
    </ErrorBoundary>
  );
}
