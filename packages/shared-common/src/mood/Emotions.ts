export enum EmotionCategoryEnum {
  JOY = 'joy',
  SADNESS = 'sadness',
  FEAR = 'fear',
  ANGER = 'anger',
  SURPRISE = 'surprise',
  DISGUST = 'disgust',
}

export const EmotionsByCategory = {
  [EmotionCategoryEnum.JOY]: [
    'happiness',
    'contentment',
    'pride',
    'optimism',
    'relief',
    'excitement',
    'elation',
    'satisfaction',
    'gratitude',
    'joyfulness',
    'enthusiasm',
    'euphoria',
    'delight',
    'cheerfulness',
    'amusement',
  ],
  [EmotionCategoryEnum.SADNESS]: [
    'loneliness',
    'despair',
    'grief',
    'melancholy',
    'sorrow',
    'disappointment',
    'hopelessness',
    'regret',
    'remorse',
    'mourning',
    'dismay',
    'heartache',
    'pessimism',
    'woe',
    'desolation',
  ],
  [EmotionCategoryEnum.FEAR]: [
    'anxiety',
    'nervousness',
    'worry',
    'trepidation',
    'panic',
    'dread',
    'fright',
    'apprehension',
    'horror',
    'terror',
    'unease',
    'phobia',
    'alarm',
    'intimidation',
    'consternation',
  ],
  [EmotionCategoryEnum.ANGER]: [
    'frustration',
    'irritation',
    'rage',
    'annoyance',
    'resentment',
    'fury',
    'outrage',
    'wrath',
    'hostility',
    'exasperation',
    'vexation',
    'indignation',
    'aggravation',
    'bitterness',
  ],
  [EmotionCategoryEnum.SURPRISE]: [
    'amazement',
    'shock',
    'astonishment',
    'wonder',
    'bewilderment',
    'stupefaction',
    'flabbergast',
    'startlement',
    'incredulity',
    'awe',
    'dumbfounded',
    'perplexity',
    'disbelief',
    'unexpectedness',
    'marvel',
  ],
  [EmotionCategoryEnum.DISGUST]: [
    'contempt',
    'revulsion',
    'distaste',
    'aversion',
    'loathing',
    'abhorrence',
    'nausea',
    'repugnance',
    'antipathy',
    'detestation',
    'repulsion',
    'scorn',
    'disdain',
    'sickening',
  ],
};

export const EmotionCategoryColors = {
  [EmotionCategoryEnum.JOY]: '#FFC107',
  [EmotionCategoryEnum.SADNESS]: '#2A9DF4',
  [EmotionCategoryEnum.FEAR]: '#9E8FB2',
  [EmotionCategoryEnum.ANGER]: '#D32F2F',
  [EmotionCategoryEnum.SURPRISE]: '#FFCA28',
  [EmotionCategoryEnum.DISGUST]: '#66BB6A',
};

export const EmotionToEmotionCategoryMap = new Map(
  Object.entries(EmotionsByCategory).flatMap(([category, emotions]) =>
    emotions.map((emotion) => [emotion, category])
  )
);
