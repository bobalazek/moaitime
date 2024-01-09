import { formatRelative } from 'date-fns';

import { MoodEntry as MoodEntryType } from '@moaitime/shared-common';

import { HappinessScoreIcon } from './HappinesScoreIcon';

export const MoodEntry = ({ moodEntry }: { moodEntry: MoodEntryType }) => {
  const loggedAtRelative = formatRelative(new Date(moodEntry.loggedAt), new Date());

  return (
    <div className="bg-muted flex flex-row items-center rounded-xl p-4">
      <div className="flex w-12 flex-shrink text-3xl">
        <HappinessScoreIcon score={moodEntry.happinessScore} />
      </div>
      <div className="flex flex-grow flex-col">
        <div className="text-sm font-semibold">{loggedAtRelative}</div>
        {moodEntry.description && <div className="text-sm">{moodEntry.description}</div>}
      </div>
    </div>
  );
};
