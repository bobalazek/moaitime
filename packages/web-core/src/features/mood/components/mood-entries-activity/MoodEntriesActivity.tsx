import { AnimatePresence, motion } from 'framer-motion';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import { useIntersectionObserver } from 'usehooks-ts';

import { GlobalEventsEnum, MoodEntry as MoodEntryType } from '@moaitime/shared-common';
import { Button } from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../../auth/state/authStore';
import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { globalEventsEmitter } from '../../../core/state/globalEventsEmitter';
import { useMoodEntriesQuery } from '../../hooks/useMoodEntriesQuery';
import { playAddMoodEntrySound } from '../../utils/MoodHelpers';
import { MoodEntry } from '../mood-entry/MoodEntry';

const animationVariants = {
  initial: { opacity: 0, y: -100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100 },
};

const getHeading = (date: Date) => {
  return date.toLocaleString('default', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

function FetchNextPageButton({ fetchNextPage }: { fetchNextPage: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    if (isVisible) {
      fetchNextPage();
    }
  }, [isVisible, fetchNextPage]);

  return (
    <Button ref={ref} className="btn btn-primary" onClick={() => fetchNextPage()}>
      Load More
    </Button>
  );
}

function MoodEntriesActivityInner() {
  const { data, isLoading, hasNextPage, fetchNextPage, fetchPreviousPage, refetch, error } =
    useMoodEntriesQuery();

  const items = useMemo(() => {
    return data?.pages.flatMap((page) => page.data!) ?? [];
  }, [data]);

  useEffect(() => {
    const callbackAdded = () => {
      if (items?.length === 0) {
        refetch();

        return;
      }

      // I have absolutely no idea why this is needed, but it is, otherwise for some reason the refetch does not work,
      // as altough we do get the new data pulled from the API, the data.pages does not contain the newest entry.
      setTimeout(() => {
        fetchPreviousPage();
      }, 100);
    };

    const callbackEdited = () => {
      refetch();
    };

    globalEventsEmitter.on(GlobalEventsEnum.MOOD_MOOD_ENTRY_ADDED, callbackAdded);
    globalEventsEmitter.on(GlobalEventsEnum.MOOD_MOOD_ENTRY_EDITED, callbackEdited);
    globalEventsEmitter.on(GlobalEventsEnum.MOOD_MOOD_ENTRY_DELETED, callbackEdited);
    globalEventsEmitter.on(GlobalEventsEnum.MOOD_MOOD_ENTRY_UNDELETED, callbackEdited);

    return () => {
      globalEventsEmitter.off(GlobalEventsEnum.MOOD_MOOD_ENTRY_ADDED, callbackAdded);
      globalEventsEmitter.off(GlobalEventsEnum.MOOD_MOOD_ENTRY_EDITED, callbackEdited);
      globalEventsEmitter.off(GlobalEventsEnum.MOOD_MOOD_ENTRY_DELETED, callbackEdited);
      globalEventsEmitter.off(GlobalEventsEnum.MOOD_MOOD_ENTRY_UNDELETED, callbackEdited);
    };
  }, [items, fetchPreviousPage, refetch]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  let lastHeading: string | undefined;

  return (
    <>
      {items.length === 0 && (
        <div className="text-muted-foreground justify-center text-center">
          <div className="mb-3 text-3xl">No mood entries just yet.</div>
          <div>Why not add one? It is free, you know that, right?</div>
          <div className="absolute right-4 top-12 select-none text-center text-5xl">
            <div>☝️</div>
            <div className="mt-2 text-[0.65rem] leading-tight">
              Press here. <br /> Gently please.
            </div>
          </div>
        </div>
      )}
      {items.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {items.map((moodEntry) => {
                let isHeadingChanged = false;
                const date = new Date(moodEntry.loggedAt);
                const heading = getHeading(date);

                if (heading !== lastHeading) {
                  lastHeading = heading;
                  isHeadingChanged = true;
                }

                return (
                  <Fragment key={moodEntry.id}>
                    {isHeadingChanged && (
                      <div key={heading} className="text-center text-lg font-bold">
                        {heading}
                      </div>
                    )}
                    <motion.div
                      layout
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={animationVariants}
                    >
                      <MoodEntry moodEntry={moodEntry} />
                    </motion.div>
                  </Fragment>
                );
              })}
            </AnimatePresence>
          </div>
          {hasNextPage && (
            <div className="mt-4 flex justify-center">
              <FetchNextPageButton fetchNextPage={fetchNextPage} />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function MoodEntriesActivity() {
  const [showConfetti, setShowConfetti] = useState(false);
  const moodSoundsEnabled = useAuthUserSetting('moodSoundsEnabled', false);

  useEffect(() => {
    if (!moodSoundsEnabled) {
      return;
    }

    const moodEntryAddedCallback = ({ moodEntry }: { moodEntry?: MoodEntryType }) => {
      if (!moodEntry) {
        return;
      }

      setShowConfetti(true);

      playAddMoodEntrySound(moodEntry.happinessScore);
    };

    globalEventsEmitter.on(GlobalEventsEnum.MOOD_MOOD_ENTRY_ADDED, moodEntryAddedCallback);

    return () => {
      globalEventsEmitter.off(GlobalEventsEnum.MOOD_MOOD_ENTRY_ADDED, moodEntryAddedCallback);
    };
  }, [moodSoundsEnabled]);

  return (
    <div data-test="mood--mood-entries-activity">
      {showConfetti && (
        <ConfettiExplosion
          zIndex={9999}
          particleSize={6}
          particleCount={50}
          duration={2200}
          onComplete={() => {
            setShowConfetti(false);
          }}
        />
      )}
      <MoodEntriesActivityInner />
    </div>
  );
}
