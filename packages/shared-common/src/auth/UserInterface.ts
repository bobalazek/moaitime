export interface UserInterface {
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
