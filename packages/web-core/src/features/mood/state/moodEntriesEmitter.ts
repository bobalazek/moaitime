import mitt from 'mitt';

import { MoodEntry } from '@moaitime/shared-common';

export enum MoodEntriesEventsEnum {
  MOOD_ENTRY_ADDED = 'mood:mood-entry:added',
  MOOD_ENTRY_EDITED = 'mood:mood-entry:edited',
  MOOD_ENTRY_DELETED = 'mood:mood-entry:deleted',
  MOOD_ENTRY_UNDELETED = 'mood:mood-entry:undeleted',
}

export type MoodEntriesEmitterEvents = {
  [MoodEntriesEventsEnum.MOOD_ENTRY_ADDED]: { moodEntry: MoodEntry };
  [MoodEntriesEventsEnum.MOOD_ENTRY_EDITED]: { moodEntry: MoodEntry };
  [MoodEntriesEventsEnum.MOOD_ENTRY_DELETED]: { moodEntry: MoodEntry; isHardDelete: boolean };
  [MoodEntriesEventsEnum.MOOD_ENTRY_UNDELETED]: { moodEntry: MoodEntry };
};

export const moodEntriesEmitter = mitt<MoodEntriesEmitterEvents>();
