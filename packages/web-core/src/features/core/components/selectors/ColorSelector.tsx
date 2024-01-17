import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { MAIN_COLORS } from '@moaitime/shared-common';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@moaitime/web-ui';

const EMPTY_VALUE_PLACEHOLDER = '__empty';
const CUSTOM_VALUE_PLACEHOLDER = '__custom';

export function ColorSelector({
  value,
  onChangeValue,
  placeholderText,
  disableClear,
  allowCustomColors,
  triggerProps,
  contentProps,
}: {
  value?: string;
  onChangeValue: (value?: string) => void;
  disableClear?: boolean;
  allowCustomColors?: boolean;
  placeholderText?: string;
  triggerProps?: Record<string, string>;
  contentProps?: Record<string, string>;
}) {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(value);
  const isSelectedColorCustom =
    value && !MAIN_COLORS.some((color) => color.value === selectedColor);
  const [customColor, setCustomColor] = useState<string | undefined>(
    isSelectedColorCustom ? value : undefined
  );
  const customColorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedColor(value);
    setCustomColor(isSelectedColorCustom ? value : undefined);
  }, [value, isSelectedColorCustom]);

  const onSave = (newValue: string) => {
    if (newValue === CUSTOM_VALUE_PLACEHOLDER) {
      customColorInputRef.current?.click();

      return;
    }

    onChangeValue(newValue !== EMPTY_VALUE_PLACEHOLDER ? newValue : undefined);
  };

  const onDebouncedCustomColorSave = useDebouncedCallback(() => {
    if (!customColor) {
      return;
    }

    onSave(customColor);
  }, 500);

  const onCustomColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(event.target.value);

    onDebouncedCustomColorSave();
  };

  return (
    <Select value={selectedColor ?? EMPTY_VALUE_PLACEHOLDER} onValueChange={onSave}>
      <SelectTrigger className="relative w-full" {...triggerProps}>
        <SelectValue placeholder="Color" />
        <Input
          ref={customColorInputRef}
          type="color"
          value={customColor ?? '#000000'}
          onChange={onCustomColorChange}
          className="absolute h-0 w-0 opacity-0"
        />
      </SelectTrigger>
      <SelectContent {...contentProps}>
        {(!value || !disableClear) && (
          <SelectItem value={EMPTY_VALUE_PLACEHOLDER}>
            <i>{placeholderText ?? 'None'}</i>
          </SelectItem>
        )}
        {(isSelectedColorCustom || allowCustomColors) && (
          <SelectItem value={customColor ?? CUSTOM_VALUE_PLACEHOLDER} disabled={!allowCustomColors}>
            <span className="inline-block">Custom</span>
            <span
              className="ml-2 inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: customColor }}
            ></span>
          </SelectItem>
        )}
        {MAIN_COLORS.map((color) => (
          <SelectItem key={color.value} value={color.value}>
            <span className="inline-block">{color.name}</span>
            <span
              className="ml-2 inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: color.value }}
            ></span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
