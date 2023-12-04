import { UserInterface } from '@myzenbuddy/shared-common';

export class UserDto implements UserInterface {
  id: string;
  displayName: string;
  email: string;
  newEmail: string | null;
  roles: string[];
  birthDate: string | null;
  emailConfirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
