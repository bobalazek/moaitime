export enum EmotionCategoryEnum {
  JOY = 'joy',
  SADNESS = 'sadness',
  FEAR = 'fear',
  ANGER = 'anger',
  SURPRISE = 'surprise',
  DISGUST = 'disgust',
}

export const EmotionsByCategory = {
  [EmotionCategoryEnum.JOY]: ['happiness', 'excitement', 'gratitude', 'joyfulness', 'delight'],
  [EmotionCategoryEnum.SADNESS]: ['loneliness', 'grief', 'sorrow', 'regret', 'melancholy'],
  [EmotionCategoryEnum.FEAR]: ['anxiety', 'panic', 'dread', 'terror', 'horror'],
  [EmotionCategoryEnum.ANGER]: ['frustration', 'irritation', 'rage', 'resentment', 'fury'],
  [EmotionCategoryEnum.SURPRISE]: ['amazement', 'astonishment', 'shock', 'wonder', 'bewilderment'],
  [EmotionCategoryEnum.DISGUST]: ['contempt', 'revulsion', 'loathing', 'nausea', 'disdain'],
};

export const EmotionCategoryColors = {
  [EmotionCategoryEnum.JOY]: '#4CAF50',
  [EmotionCategoryEnum.SADNESS]: '#2196F3',
  [EmotionCategoryEnum.FEAR]: '#BA68C8',
  [EmotionCategoryEnum.ANGER]: '#E53935',
  [EmotionCategoryEnum.SURPRISE]: '#FFA726',
  [EmotionCategoryEnum.DISGUST]: '#8D6E63',
};

export const EmotionToEmotionCategoryMap = new Map(
  Object.entries(EmotionsByCategory).flatMap(([category, emotions]) =>
    emotions.map((emotion) => [emotion, category])
  )
);
