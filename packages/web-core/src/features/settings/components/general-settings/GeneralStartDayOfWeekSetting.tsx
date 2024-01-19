import { DayOfWeek } from '@moaitime/shared-common';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@moaitime/web-ui';

const startDayOfWeekOptions = [
  {
    label: 'Sunday',
    value: 0,
  },
  {
    label: 'Monday',
    value: 1,
  },
  {
    label: 'Tuesday',
    value: 2,
  },
  {
    label: 'Wednesday',
    value: 3,
  },
  {
    label: 'Thursday',
    value: 4,
  },
  {
    label: 'Friday',
    value: 5,
  },
  {
    label: 'Saturday',
    value: 6,
  },
];

export type GeneralStartDayOfWeekSettingProps = {
  value: DayOfWeek;
  onValueChange: (value: DayOfWeek) => void;
};

export default function GeneralStartDayOfWeekSetting({
  value,
  onValueChange,
}: GeneralStartDayOfWeekSettingProps) {
  return (
    <Select
      value={value.toString()}
      onValueChange={(value) => {
        onValueChange(parseInt(value) as DayOfWeek);
      }}
    >
      <SelectTrigger className="w-full" id="settings-generalStartDayOfWeek">
        <SelectValue placeholder="Start day of week" />
      </SelectTrigger>
      <SelectContent data-test="general--settings--startDayOfWeek">
        {startDayOfWeekOptions.map(({ label, value }) => (
          <SelectItem key={value} value={value.toString()}>
            <span className="inline-block">{label}</span>
            <span className="ml-2 inline-block h-2 w-2 rounded-full"></span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
