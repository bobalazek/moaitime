import { useEffect, useRef, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

import { MoodEntry as MoodEntryType } from '@moaitime/shared-common';

import { ErrorAlert } from '../../../core/components/ErrorAlert';
import { Loader } from '../../../core/components/Loader';
import { useMoodEntriesQuery } from '../../hooks/useMoodEntriesQuery';
import { MoodEntry } from '../common/MoodEntry';

export default function MoodEntriesActivity() {
  const [showConfetti, setShowConfetti] = useState(false);
  const { data, isLoading, error } = useMoodEntriesQuery();
  const lastMoodEntryRef = useRef<MoodEntryType | null>(null);

  useEffect(() => {
    if (!data) {
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
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">No mood entries yet.</p>
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
