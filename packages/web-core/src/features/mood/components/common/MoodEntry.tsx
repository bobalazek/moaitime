import { MoodEntry as MoodEntryType } from '@moaitime/shared-common';

import { HappinessScoreIcon } from './HappinesScoreIcon';
import { MoodEntryActions } from './MoodEntryActions';

export const MoodEntry = ({ moodEntry }: { moodEntry: MoodEntryType }) => {
  const date = new Date(moodEntry.loggedAt).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    <div
      className="bg-muted flex flex-row items-center rounded-xl p-4"
      data-mood-entry-id={moodEntry.id}
      data-test="mood--mood-entry"
    >
      <div className="flex w-12 flex-shrink text-3xl">
        <HappinessScoreIcon score={moodEntry.happinessScore} />
      </div>
      <div className="flex flex-grow items-center justify-between">
        <div className="flex flex-col">
          <div className="font-semibold" data-test="mood--mood-entry--logged-at">
            {date}
          </div>
          {moodEntry.note && (
            <div className="text-muted-foreground text-xs" data-test="mood--mood-entry--note">
              {moodEntry.note}
            </div>
          )}
        </div>
        <div>
          <MoodEntryActions moodEntry={moodEntry} />
        </div>
      </div>
    </div>
  );
};
