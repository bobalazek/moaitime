import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { ErrorBoundary } from '../../core/components/ErrorBoundary';
import { useBackgroundStore } from '../state/backgroundStore';

const preloadImage = (src: string, callback: () => void) => {
  const img = new Image();
  img.onload = callback;
  img.src = src;
};

export default function Background() {
  const { background: background } = useBackgroundStore();
  const [currentImage, setCurrentImage] = useState(background?.imageUrl);

  useEffect(() => {
    const newImageUrl = background?.imageUrl;
    if (newImageUrl && newImageUrl !== currentImage) {
      preloadImage(newImageUrl, () => {
        setCurrentImage(newImageUrl);
      });
    }
  }, [background, currentImage]);

  return (
    <ErrorBoundary>
      <div className="full-screen z--1" data-test="background">
        <AnimatePresence>
          {currentImage && (
            <motion.div
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="full-screen bg-cover bg-fixed bg-center bg-no-repeat"
              style={{ backgroundImage: `url("${currentImage}")`, filter: 'contrast(0.8)' }}
            />
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
