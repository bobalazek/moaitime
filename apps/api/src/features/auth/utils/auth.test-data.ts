import { User, UserAccessToken } from '@moaitime/database-core';
import { authManager } from '@moaitime/database-services';
import { UserRoleEnum } from '@moaitime/shared-common';

const now = new Date();

export const getTestUser = async (): Promise<User> => ({
  id: 'test',
  displayName: 'Test',
  username: 'test',
  email: 'test@test.com',
  newEmail: null,
  beforeDeletionEmail: null,
  password: await authManager.hashPassword('test'),
  roles: [UserRoleEnum.USER],
  settings: null,
  avatarImageUrl: null,
  biography: null,
  isPrivate: false,
  birthDate: '1990-01-01',
  emailConfirmationToken: 'test-email-confirmation-token',
  newEmailConfirmationToken: null,
  passwordResetToken: null,
  deletionToken: null,
  lockedReason: null,
  emailConfirmedAt: null,
  emailConfirmationLastSentAt: null,
  newEmailConfirmationLastSentAt: null,
  passwordResetLastRequestedAt: null,
  lockedAt: null,
  lockedUntilAt: null,
  deletionRequestedAt: null,
  deletedAt: null,
  createdAt: now,
  updatedAt: now,
});
export const getTestUserAccessToken = (user: User): UserAccessToken => ({
  id: 'test',
  token: 'test-token',
  userAgent: 'test-user-agent',
  userAgentParsed: null,
  revokedReason: null,
  refreshToken: 'test-refresh-token',
  refreshTokenClaimedAt: null,
  expiresAt: null,
  revokedAt: null,
  createdAt: now,
  updatedAt: now,
  userId: user.id,
});
