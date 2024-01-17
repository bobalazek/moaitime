import { PRIORITIES } from '@moaitime/shared-common';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@moaitime/web-ui';

const EMPTY_VALUE_PLACEHOLDER = '__empty';

export function PrioritySelector({
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
  return (
    <Select
      value={value ?? EMPTY_VALUE_PLACEHOLDER}
      onValueChange={(value) => {
        onChangeValue(value !== EMPTY_VALUE_PLACEHOLDER ? value : undefined);
      }}
    >
      <SelectTrigger className="w-full" {...triggerProps}>
        <SelectValue placeholder="Priority" />
      </SelectTrigger>
      <SelectContent {...contentProps}>
        <SelectItem value={EMPTY_VALUE_PLACEHOLDER}>
          <i>{placeholderText ?? 'None'}</i>
        </SelectItem>
        {PRIORITIES.map((priority) => (
          <SelectItem key={priority.value} value={priority.value.toString()}>
            <span className="inline-block">{priority.name}</span>
            <span
              className="ml-2 inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: priority.color }}
            ></span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
