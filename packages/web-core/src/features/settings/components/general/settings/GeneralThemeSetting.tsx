import { ThemeEnum } from '@moaitime/shared-common';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@moaitime/web-ui';

const themeOptions = [
  {
    label: 'System',
    value: ThemeEnum.SYSTEM,
  },
  {
    label: 'Light',
    value: ThemeEnum.LIGHT,
  },
  {
    label: 'Dark',
    value: ThemeEnum.DARK,
  },
];

export type GeneralThemeSettingProps = {
  value: ThemeEnum;
  onValueChange: (value: ThemeEnum) => void;
};

export default function GeneralThemeSetting({ value, onValueChange }: GeneralThemeSettingProps) {
  return (
    <Select
      value={value.toString()}
      onValueChange={(value) => {
        onValueChange(value as ThemeEnum);
      }}
    >
      <SelectTrigger className="w-full" id="settings-generalTheme">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent data-test="general--settings--theme">
        {themeOptions.map(({ label, value }) => (
          <SelectItem key={value} value={value.toString()}>
            <span className="inline-block">{label}</span>
            <span className="ml-2 inline-block h-2 w-2 rounded-full"></span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
