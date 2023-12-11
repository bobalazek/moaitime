import { UserInterface, UserSettings } from '@myzenbuddy/shared-common';

export class UserDto implements UserInterface {
  id!: string;
  displayName!: string;
  email!: string;
  newEmail!: string | null;
  roles!: string[];
  birthDate!: string | null;
  emailConfirmedAt!: string | null;
  settings!: UserSettings;
  createdAt!: string;
  updatedAt!: string;
}
