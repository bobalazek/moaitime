import { useEffect, useRef, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

import { MoodEntry as MoodEntryType } from '@moaitime/shared-common';

import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { useMoodEntriesQuery } from '../../hooks/useMoodEntriesQuery';
import { MoodEntry } from '../common/MoodEntry';

export default function MoodEntriesActivity() {
  const { data, isLoading, error } = useMoodEntriesQuery();
  const [showConfetti, setShowConfetti] = useState(false);
  const lastMoodEntryRef = useRef<MoodEntryType | null>(null);
  const dataIsEmpty = useRef<boolean>(false);

  useEffect(() => {
    // This convers the cases where we want to show the confetti for the very first entry
    if (typeof data !== 'undefined' && data.length === 0) {
      dataIsEmpty.current = true;
    }

    if (dataIsEmpty.current && data && data.length > 0) {
      dataIsEmpty.current = false;
      setShowConfetti(true);
    }

    if (!data || data.length === 0) {
      return;
    }

    if (!lastMoodEntryRef.current) {
      lastMoodEntryRef.current = data[0];

      return;
    }

    if (data[0].id === lastMoodEntryRef.current.id) {
      return;
    }

    setShowConfetti(true);

    lastMoodEntryRef.current = data[0];
  }, [data]);

  if (!data) {
    return null;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

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
      {data.length === 0 && (
        <div className="text-muted-foreground justify-center space-y-3 text-center">
          <div className="text-2xl">No mood entries just yet.</div>
          <div>Why not add one?</div>
          <div>It is free, you know that, right?</div>
        </div>
      )}
      {data.length > 0 && (
        <div className="flex flex-col gap-4">
          {data.map((moodEntry) => {
            return <MoodEntry key={moodEntry.id} moodEntry={moodEntry} />;
          })}
        </div>
      )}
    </div>
  );
}
