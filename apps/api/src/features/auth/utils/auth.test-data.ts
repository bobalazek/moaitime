import { User } from '@myzenbuddy/database-core';
import { authManager } from '@myzenbuddy/database-services';
import { UserRoleEnum } from '@myzenbuddy/shared-common';

const now = new Date();

export const getTestUser = async (): Promise<User> => ({
  id: 'test',
  displayName: 'Test',
  email: 'test@test.com',
  newEmail: null,
  beforeDeletionEmail: null,
  password: await authManager.hashPassword('test'),
  roles: [UserRoleEnum.USER],
  settings: null,
  birthDate: '1990-01-01',
  emailConfirmationToken: 'test-email-confirmation-token',
  newEmailConfirmationToken: null,
  passwordResetToken: null,
  emailConfirmedAt: null,
  emailConfirmationLastSentAt: null,
  newEmailConfirmationLastSentAt: null,
  passwordResetLastRequestedAt: null,
  deletionRequestedAt: null,
  deletedAt: null,
  createdAt: now,
  updatedAt: now,
});
export const getTestUserAccessToken = (user: User) => ({
  id: 'test',
  token: 'test-token',
  refreshToken: 'test-refresh-token',
  refreshTokenClaimedAt: null,
  expiresAt: null,
  revokedAt: null,
  createdAt: now,
  updatedAt: now,
  userId: user.id,
});
