import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

import Auth from '../../auth/components/Auth';
import { useAuthUserSetting } from '../../auth/state/authStore';
import Background from '../../background/components/Background';
import BackgroundInformation from '../../background/components/BackgroundInfromation';
import Clock from '../../clock/components/Clock';
import Greeting from '../../greeting/components/Greeting';
import Quote from '../../quote/components/Quote';
import Search from '../../search/components/Search';
import { ErrorBoundary } from '../components/ErrorBoundary';
import AppsDock from './home/AppsDock';

const animationVariants = {
  initial: { opacity: 0, y: -100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100 },
};

export default function HomePage() {
  const clockEnabled = useAuthUserSetting('clockEnabled', false);
  const greetingEnabled = useAuthUserSetting('greetingEnabled', false);
  const searchEnabled = useAuthUserSetting('searchEnabled', false);
  const quoteEnabled = useAuthUserSetting('quoteEnabled', false);

  useEffect(() => {
    document.title = 'MoaiTime';
  }, []);

  return (
    <ErrorBoundary>
      <Auth />
      <Background />
      <div className="full-screen flex flex-col">
        <div className="flex-shrink-1 flex justify-between p-3">
          <div className="flex gap-4">
            <BackgroundInformation />
          </div>
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
                className="mt-6"
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
            {quoteEnabled && (
              <motion.div
                key="quote"
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
                className="mt-8"
              >
                <Quote />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AppsDock />
      </div>
    </ErrorBoundary>
  );
}
