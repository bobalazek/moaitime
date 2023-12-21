import { MAIN_COLORS } from '@moaitime/shared-common';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@moaitime/web-ui';

const __EMPTY_VALUE_PLACEHOLDER = '__empty';

export function ColorSelector({
  value,
  onChangeValue,
  triggerProps,
  contentProps,
}: {
  value?: string;
  onChangeValue: (value?: string) => void;
  triggerProps?: Record<string, string>;
  contentProps?: Record<string, string>;
}) {
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
          <i>None</i>
        </SelectItem>
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
