import { MAIN_COLORS } from '@moaitime/shared-common';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@moaitime/web-ui';

const __EMPTY_VALUE_PLACEHOLDER = '__empty';

export function ColorSelector({
  value,
  onChangeValue,
  placeholderText,
  triggerProps,
  contentProps,
}: {
  value?: string;
  onChangeValue: (value?: string) => void;
  placeholderText?: string;
  triggerProps?: Record<string, string>;
  contentProps?: Record<string, string>;
}) {
  const isSelectedColorCustom = value && !MAIN_COLORS.some((color) => color.value === value);

  return (
    <Select
      value={value ?? __EMPTY_VALUE_PLACEHOLDER}
      onValueChange={(value) => {
        onChangeValue(value !== __EMPTY_VALUE_PLACEHOLDER ? value : undefined);
      }}
    >
      <SelectTrigger className="w-full" {...triggerProps}>
        <SelectValue placeholder="Color" />
      </SelectTrigger>
      <SelectContent {...contentProps}>
        <SelectItem value={__EMPTY_VALUE_PLACEHOLDER}>
          <i>{placeholderText ?? 'None'}</i>
        </SelectItem>
        {isSelectedColorCustom && (
          <SelectItem value={value}>
            <span className="inline-block">Custom</span>
            <span
              className="ml-2 inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: value }}
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
