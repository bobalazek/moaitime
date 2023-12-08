import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { ErrorBoundary } from '../../core/components/ErrorBoundary';
import { useGreeting } from '../hooks/useGreeting';
import { useGreetingStore } from '../state/greetingStore';

type GreetingCharacters = {
  char: string;
  delay: number;
}[];

const animationVariants = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
};

const defaultCharacters = [{ char: '\u00A0', delay: 0 }];

export default function Greeting() {
  const { setRandomGreeting } = useGreetingStore();
  const greeting = useGreeting();
  const [textCharacters, setTextCharacters] = useState<GreetingCharacters>(defaultCharacters);

  useEffect(() => {
    const currentText = textCharacters.map(({ char }) => char).join('');
    const newText = greeting?.text || '';
    if (currentText === newText) {
      return;
    }

    setTextCharacters(defaultCharacters);

    if (!newText) {
      return;
    }

    setTimeout(() => {
      setTextCharacters(
        newText.split('').map((char, index) => ({
          char,
          delay: index * 0.06,
        }))
      );
    }, 10);
  }, [textCharacters, greeting]);

  return (
    <ErrorBoundary>
      <div
        className="text-shadow cursor-default select-none px-4 text-3xl font-bold md:text-5xl lg:text-6xl"
        onDoubleClick={() => {
          setRandomGreeting();
        }}
        data-test="greeting"
      >
        {textCharacters.map(({ char, delay }, index) => (
          <motion.span
            key={`${greeting?.text}-${index}`}
            initial="initial"
            animate="animate"
            variants={animationVariants}
            transition={{ delay, type: 'tween' }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    </ErrorBoundary>
  );
}
