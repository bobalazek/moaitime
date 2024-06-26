import { useState } from 'react';

import {
  capitalize,
  EmotionCategoryColors,
  EmotionCategoryEnum,
  EmotionsByCategory,
  EmotionToEmotionCategoryMap,
} from '@moaitime/shared-common';
import { Button, Input, Popover, PopoverContent, PopoverTrigger, Toggle } from '@moaitime/web-ui';

import { getTextColor } from '../../../core/utils/ColorHelpers';

const emotionCategories = Object.keys(EmotionsByCategory);

export type EmotionsProps = {
  value?: string[];
  onChangeValue: (value: string[]) => void;
};

export function EmotionsSelector({ value, onChangeValue }: EmotionsProps) {
  const [selectedEmotionCategories, setSelectedEmotionCategories] = useState<string[]>([]);
  const [customEmotionPopoverOpen, setCustomEmotionPopoverOpen] = useState<boolean>(false);
  const [customEmotionText, setCustomEmotionText] = useState<string>('');

  const selectedEmotions = value ?? [];
  const availableEmotions = Array.from(
    new Set([
      ...(value ?? []),
      ...selectedEmotionCategories.flatMap(
        (category) => EmotionsByCategory[category as EmotionCategoryEnum]
      ),
    ])
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {emotionCategories.map((emotionCategory) => {
          const isCategoryPressed = selectedEmotionCategories.includes(emotionCategory);
          const backgroundColor = EmotionCategoryColors[emotionCategory as EmotionCategoryEnum]
            ? EmotionCategoryColors[emotionCategory as EmotionCategoryEnum]
            : '#E0E0E0';
          const color = getTextColor(backgroundColor);

          return (
            <Toggle
              key={emotionCategory}
              size="sm"
              className="border-2 transition-all"
              pressed={isCategoryPressed}
              onPressedChange={(pressed) => {
                setSelectedEmotionCategories(
                  pressed
                    ? [...selectedEmotionCategories, emotionCategory]
                    : selectedEmotionCategories.filter((e) => e !== emotionCategory)
                );
              }}
              style={{
                backgroundColor: isCategoryPressed ? backgroundColor : undefined,
                color: isCategoryPressed ? color : undefined,
                borderColor: backgroundColor,
              }}
            >
              {capitalize(emotionCategory)}
            </Toggle>
          );
        })}
        <Popover open={customEmotionPopoverOpen} onOpenChange={setCustomEmotionPopoverOpen}>
          <PopoverTrigger asChild>
            <Toggle size="sm" className="border-2 transition-all">
              + Custom
            </Toggle>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <div className="flex flex-col gap-3 p-3">
              <Input
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="Custom emotion"
                value={customEmotionText}
                onChange={(e) => setCustomEmotionText(e.target.value)}
              />
              <Button
                className="w-full"
                size="sm"
                onClick={() => {
                  if (!customEmotionText) {
                    return;
                  }

                  onChangeValue([...selectedEmotions, customEmotionText]);
                  setCustomEmotionText('');
                  setCustomEmotionPopoverOpen(false);
                }}
              >
                Add
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {availableEmotions.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {availableEmotions.map((emotion) => {
            const emotionCategory = EmotionToEmotionCategoryMap.get(emotion) as EmotionCategoryEnum;
            const isPressed = selectedEmotions.includes(emotion);
            const backgroundColor = EmotionCategoryColors[emotionCategory]
              ? EmotionCategoryColors[emotionCategory]
              : undefined;
            const color = getTextColor(backgroundColor);

            return (
              <Toggle
                key={emotion}
                size="sm"
                className="border-2 transition-all"
                pressed={isPressed}
                onPressedChange={(pressed) => {
                  onChangeValue(
                    pressed
                      ? [...selectedEmotions, emotion]
                      : selectedEmotions.filter((e) => e !== emotion)
                  );
                }}
                style={{
                  backgroundColor: isPressed ? backgroundColor : undefined,
                  color: isPressed ? color : undefined,
                  borderColor: backgroundColor,
                }}
              >
                {emotion}
              </Toggle>
            );
          })}
        </div>
      )}
    </div>
  );
}
