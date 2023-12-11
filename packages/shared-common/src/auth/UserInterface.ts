import { UserSettings } from './UserSettingsSchema';

export interface UserInterface {
  id: string;
  displayName: string;
  email: string;
  newEmail: string | null;
  roles: string[];
  settings: UserSettings;
  birthDate: string | null;
  emailConfirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
