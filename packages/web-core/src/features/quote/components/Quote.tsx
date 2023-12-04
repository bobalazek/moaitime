import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { ErrorBoundary } from '../../core/components/ErrorBoundary';
import { useQuoteStore } from '../state/quoteStore';

type Characters = {
  char: string;
  delay: number;
}[];

const animationVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const defaultCharacters = [{ char: '&nbsp;', delay: 0 }];

export default function Quote() {
  const { quote, setRandomQuote } = useQuoteStore();
  const [textCharacters, setTextCharacters] = useState<Characters>(defaultCharacters);
  const [authorCharacters, setAuthorCharacters] = useState<Characters>(defaultCharacters);

  useEffect(() => {
    setTextCharacters(defaultCharacters);
    setAuthorCharacters(quote?.author ? defaultCharacters : []);

    if (!quote?.text) {
      return;
    }

    setTimeout(() => {
      const text = `"${quote.text}"`;
      setTextCharacters(
        text.split('').map((char, index) => ({
          char,
          delay: index * 0.06,
        }))
      );

      if (quote.author) {
        const author = `- ${quote.author}`;
        setAuthorCharacters(
          author.split('').map((char, index) => ({
            char,
            delay: index * 0.1,
          }))
        );
      }
    }, 10);
  }, [quote]);

  return (
    <ErrorBoundary>
      <div
        className="text-shadow cursor-default select-none text-xl italic"
        onDoubleClick={() => {
          setRandomQuote();
        }}
        data-test="quote"
      >
        {textCharacters.map(({ char, delay }, index) => (
          <motion.span
            key={`${quote?.text}-${index}`}
            initial="initial"
            animate="animate"
            variants={animationVariants}
            transition={{ delay, type: 'tween' }}
          >
            {char}
          </motion.span>
        ))}
        {quote?.author && (
          <div className="text-sm">
            {authorCharacters.map(({ char, delay }, index) => (
              <motion.span
                key={`${quote?.text}-${index}`}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
                transition={{ delay, type: 'tween' }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
