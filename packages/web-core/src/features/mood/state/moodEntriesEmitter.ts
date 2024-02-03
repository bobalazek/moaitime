import mitt from 'mitt';

import { GlobalEventsEnum, MoodEntry } from '@moaitime/shared-common';

export type MoodEntriesEmitterEvents = {
  [GlobalEventsEnum.MOOD_MOOD_ENTRY_ADDED]: { moodEntry: MoodEntry };
  [GlobalEventsEnum.MOOD_MOOD_ENTRY_EDITED]: { moodEntry: MoodEntry };
  [GlobalEventsEnum.MOOD_MOOD_ENTRY_DELETED]: { moodEntry: MoodEntry; isHardDelete: boolean };
  [GlobalEventsEnum.MOOD_MOOD_ENTRY_UNDELETED]: { moodEntry: MoodEntry };
};

export const moodEntriesEmitter = mitt<MoodEntriesEmitterEvents>();
