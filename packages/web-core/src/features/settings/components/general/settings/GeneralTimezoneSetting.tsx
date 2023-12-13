import { getTimezones } from '@moaitime/shared-common';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@moaitime/web-ui';

const timezones = getTimezones();

export type GeneralTimezoneSettingProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export default function GeneralTimezoneSetting({
  value,
  onValueChange,
}: GeneralTimezoneSettingProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full" id="settings-generalTimezone">
        <SelectValue placeholder="Start day of week" />
      </SelectTrigger>
      <SelectContent data-test="general--settings--timezone" className="max-h-64">
        {timezones.map((timezone) => (
          <SelectItem key={timezone} value={timezone}>
            <span className="inline-block">{timezone}</span>
            <span className="ml-2 inline-block h-2 w-2 rounded-full"></span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
