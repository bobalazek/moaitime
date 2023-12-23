import { AnimatePresence, motion } from 'framer-motion';

import Auth from '../../auth/components/Auth';
import { useAuthStore } from '../../auth/state/authStore';
import Background from '../../background/components/Background';
import BackgroundInformation from '../../background/components/BackgroundInfromation';
import Calendar from '../../calendar/components/Calendar';
import Clock from '../../clock/components/Clock';
import CommandsButton from '../../commands/components/CommandsButton';
import CommandsDialog from '../../commands/components/CommandsDialog';
import Greeting from '../../greeting/components/Greeting';
import Notes from '../../notes/components/Notes';
import Quote from '../../quote/components/Quote';
import Search from '../../search/components/Search';
import Settings from '../../settings/components/Settings';
import Tasks from '../../tasks/components/Tasks';
import Weather from '../../weather/components/Weather';
import { ErrorBoundary } from '../components/ErrorBoundary';

const animationVariants = {
  initial: { opacity: 0, y: -100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100 },
};

export default function HomePage() {
  const { auth } = useAuthStore();

  const calendarEnabled = auth?.user?.settings?.calendarEnabled ?? false;
  const commandsEnabled = auth?.user?.settings?.commandsEnabled ?? false;
  const commandsSearchButtonEnabled = auth?.user?.settings?.commandsSearchButtonEnabled ?? false;
  const clockEnabled = auth?.user?.settings?.clockEnabled ?? false;
  const weatherEnabled = auth?.user?.settings?.weatherEnabled ?? false;
  const greetingEnabled = auth?.user?.settings?.greetingEnabled ?? false;
  const searchEnabled = auth?.user?.settings?.searchEnabled ?? false;
  const quoteEnabled = auth?.user?.settings?.quoteEnabled ?? false;
  const tasksEnabled = auth?.user?.settings?.tasksEnabled ?? false;
  const notesEnabled = auth?.user?.settings?.notesEnabled ?? false;

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
        <div className="flex-shrink-1 flex justify-between p-4">
          <AnimatePresence>
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
            {weatherEnabled && (
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
            <Settings />
            <BackgroundInformation />
          </div>
          <AnimatePresence>
            {quoteEnabled && (
              <motion.div
                key="quote"
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
              >
                <Quote />
              </motion.div>
            )}
            <div className="flex gap-4">
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
              {tasksEnabled && (
                <motion.div
                  key="tasks"
                  layout
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={animationVariants}
                >
                  <Tasks />
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </div>
      </motion.div>
      {commandsEnabled && <CommandsDialog />}
    </ErrorBoundary>
  );
}
