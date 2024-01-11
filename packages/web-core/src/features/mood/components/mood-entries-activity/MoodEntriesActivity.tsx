import { useEffect, useRef, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import { useIntersectionObserver } from 'usehooks-ts';

import { Button } from '@moaitime/web-ui';

import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { useMoodEntriesQuery } from '../../hooks/useMoodEntriesQuery';
import { moodEntriesEmitter, MoodEntriesEventsEnum } from '../../state/moodEntriesEmitter';
import { MoodEntry } from '../common/MoodEntry';

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
      Load older
    </Button>
  );
}

function MoodEntriesActivityInner() {
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    hasPreviousPage,
    fetchPreviousPage,
    refetch,
    error,
  } = useMoodEntriesQuery();

  useEffect(() => {
    const callback = () => {
      refetch();
    };

    moodEntriesEmitter.on('*', callback);

    return () => {
      moodEntriesEmitter.off('*', callback);
    };
  }, [refetch]);

  const items = data?.pages.flatMap((page) => page.data!);
  if (!items) {
    return null;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  return (
    <>
      {items.length === 0 && (
        <div className="text-muted-foreground justify-center text-center">
          <div className="mb-3 text-3xl">No mood entries just yet.</div>
          <div>Why not add one? It is free, you know that, right?</div>
          <div className="absolute right-4 top-12 text-center text-5xl">
            <div>☝️</div>
            <div className="mt-2 text-[0.65rem] leading-tight">
              Press here. <br /> Gently please.
            </div>
          </div>
        </div>
      )}
      {items.length > 0 && (
        <div className="space-y-4">
          {hasPreviousPage && (
            <div className="flex justify-center">
              <Button className="btn btn-primary" onClick={() => fetchPreviousPage()}>
                Load newer
              </Button>
            </div>
          )}
          <div className="flex flex-col gap-4">
            {items.map((moodEntry) => {
              return <MoodEntry key={moodEntry.id} moodEntry={moodEntry} />;
            })}
          </div>
          {hasNextPage && (
            <div className="flex justify-center">
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

  useEffect(() => {
    const callback = () => {
      setShowConfetti(true);
    };

    moodEntriesEmitter.on(MoodEntriesEventsEnum.MOOD_ENTRY_ADDED, callback);

    return () => {
      moodEntriesEmitter.off(MoodEntriesEventsEnum.MOOD_ENTRY_ADDED, callback);
    };
  }, []);

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
