import {
  capitalize,
  EmotionCategoryColors,
  EmotionToEmotionCategoryMap,
  MoodEntry as MoodEntryType,
} from '@moaitime/shared-common';

import { getTextColor } from '../../../core/utils/ColorHelpers';
import { convertTextToHtml } from '../../../core/utils/TextHelpers';
import { HappinessScoreIcon } from './HappinesScore';
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
            <div
              className="text-muted-foreground text-xs"
              data-test="mood--mood-entry--note"
              dangerouslySetInnerHTML={{
                __html: convertTextToHtml(moodEntry.note),
              }}
            />
          )}
          {moodEntry.emotions && moodEntry.emotions.length > 0 && (
            <div
              className="text-muted-foreground mt-2 flex flex-wrap gap-2 text-xs"
              data-test="mood--mood-entry--emotions"
            >
              {moodEntry.emotions.map((emotion) => {
                const emotionCategory = EmotionToEmotionCategoryMap.get(
                  emotion
                ) as keyof typeof EmotionCategoryColors;
                const backgroundColor = EmotionCategoryColors[emotionCategory]
                  ? EmotionCategoryColors[emotionCategory]
                  : undefined;
                const color = getTextColor(backgroundColor);

                return (
                  <div
                    key={emotion}
                    className="rounded-full px-2 py-[2px] text-xs text-white"
                    style={{
                      backgroundColor,
                      color,
                    }}
                  >
                    {capitalize(emotion)}
                  </div>
                );
              })}
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
