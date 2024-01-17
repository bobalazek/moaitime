import { useState } from 'react';

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
  const isSelectedColorCustom = value && !MAIN_COLORS.some((color) => color.value === value);

  const [open, setOpen] = useState(false);
  const [customColor, setCustomColor] = useState<string | undefined>(
    isSelectedColorCustom ? value : undefined
  );

  const onChangeColor = (value: string) => {
    if (value === CUSTOM_VALUE_PLACEHOLDER) {
      setOpen(true);

      return;
    }

    onChangeValue(value !== EMPTY_VALUE_PLACEHOLDER ? value : undefined);
  };

  return (
    <Select
      open={open}
      onOpenChange={setOpen}
      value={value ?? EMPTY_VALUE_PLACEHOLDER}
      onValueChange={onChangeColor}
    >
      <SelectTrigger className="w-full" {...triggerProps}>
        <SelectValue placeholder="Color" />
      </SelectTrigger>
      <SelectContent {...contentProps}>
        {!disableClear && (
          <SelectItem value={EMPTY_VALUE_PLACEHOLDER}>
            <i>{placeholderText ?? 'None'}</i>
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
        {(isSelectedColorCustom || allowCustomColors) && (
          <SelectItem
            value={customColor ?? CUSTOM_VALUE_PLACEHOLDER}
            disabled={!allowCustomColors}
            className="relative"
          >
            <span className="inline-block">Custom</span>
            <span
              className="ml-2 inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: customColor }}
            ></span>
            <Input
              type="color"
              value={customColor}
              onChange={(event) => {
                setCustomColor(event.target.value);
              }}
              className="absolute h-0 w-0 opacity-0"
            />
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
