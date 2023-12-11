import { UserSettings } from '@myzenbuddy/shared-common';

export class RegisterDto {
  displayName!: string;
  email!: string;
  password!: string;
  settings?: Pick<UserSettings, 'generalTimezone' | 'clockUse24HourClock'>;
}
