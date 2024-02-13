/// <reference types="vitest" />

import { subHours, subMinutes } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { reloadDatabase } from '@moaitime/database-testing';
import { LISTS_DEFAULT_NAMES } from '@moaitime/shared-backend';

import { calendarsManager } from '../calendars/CalendarsManager';
import { listsManager } from '../tasks/ListsManager';
import { authManager } from './AuthManager';
import { userAccessTokensManager } from './UserAccessTokensManager';
import { usersManager } from './UsersManager';

describe('AuthManager.ts', () => {
  beforeAll(async () => {
    await reloadDatabase();
  });

  describe('login()', () => {
    it('should not login with invalid credentials', async () => {
      const result = () => authManager.login('invalid', 'invalid');

      await expect(result).rejects.toThrow('Invalid credentials');
    });

    it('should login with valid credentials', async () => {
      const result = await authManager.login('tester@corcosoft.com', 'password');

      expect(result.user.email).toBe('tester@corcosoft.com');
      expect(result.user.displayName).toBe('Tester');
      expect(result.userAccessToken).toBeDefined();
    });
  });

  describe('logout()', () => {
    it('should work correctly', async () => {
      const result = await authManager.login('tester@corcosoft.com', 'password');
      const token = result.userAccessToken.token;

      await authManager.logout(token);

      const userAccessToken = await userAccessTokensManager.findOneByToken(token);

      expect(userAccessToken).not.toBe(null);
      expect(userAccessToken?.token).toBe(token);
      expect(userAccessToken?.revokedAt).not.toBe(null);
      expect(userAccessToken?.expiresAt).not.toBe(null);
    });
  });

  describe('register()', () => {
    it('should prevent creating duplicate users by email', async () => {
      const result = () =>
        authManager.register({
          displayName: 'Tester',
          username: 'tester',
          email: 'tester@corcosoft.com',
          password: 'password12345',
        });

      await expect(result).rejects.toThrow('User with this email already exists');
    });

    it('should prevent creating duplicate users by username', async () => {
      const result = () =>
        authManager.register({
          displayName: 'Tester',
          username: 'tester',
          email: 'tester+custom-email@corcosoft.com',
          password: 'password12345',
        });

      await expect(result).rejects.toThrow('User with this username already exists');
    });

    it('should prevent creating a user without password', async () => {
      const result = () =>
        authManager.register({
          displayName: 'Tester0',
          username: 'tester0',
          email: 'tester+0@corcosoft.com',
        });

      await expect(result).rejects.toThrow('Password is not set');
    });

    it('should create a user successfully', async () => {
      const user = await authManager.register({
        displayName: 'Tester0',
        username: 'tester0',
        email: 'tester+0@corcosoft.com',
        password: 'password',
      });

      expect(user.displayName).toBe('Tester0');
      expect(user.email).toBe('tester+0@corcosoft.com');
      expect(user.roles).toStrictEqual(['user']);
      expect(user.emailConfirmationToken).not.toBe(null);
      expect(user.emailConfirmationLastSentAt).not.toBe(null);
    });
  });

  describe('confirmEmail()', () => {
    it('should throw an error for invalid email token', async () => {
      const result = () => authManager.confirmEmail('invalid');

      await expect(result).rejects.toThrow('Invalid email confirmation token');
    });

    it('should throw an error for invalid ne wemail token', async () => {
      const result = () => authManager.confirmEmail('invalid', true);

      await expect(result).rejects.toThrow('Invalid email confirmation token');
    });

    it('should correctly confirm a newly registered users email', async () => {
      const user = await authManager.register({
        displayName: 'Tester1',
        username: 'tester1',
        email: 'tester+1@corcosoft.com',
        password: 'password',
      });

      const updatedUser = await authManager.confirmEmail(user.emailConfirmationToken ?? '');

      expect(updatedUser.emailConfirmationToken).toBe(null);
    });

    it('should not re-confirm the email if it was already confirmed', async () => {
      const user = await authManager.register({
        displayName: 'Tester2',
        username: 'tester2',
        email: 'tester+2@corcosoft.com',
        password: 'password',
      });

      await usersManager.updateOneById(user.id, {
        emailConfirmedAt: new Date(),
      });

      const result = () => authManager.confirmEmail(user.emailConfirmationToken ?? '');

      await expect(result).rejects.toThrow('Email already confirmed');
    });

    it('should currectly verify new email', async () => {
      const user = await authManager.register({
        displayName: 'Tester3',
        username: 'tester3',
        email: 'tester+3@corcosoft.com',
        password: 'password',
      });

      const newEmail = 'tester+3newemail@corcosoft.com';
      const newEmailConfirmationToken = uuidv4();
      await usersManager.updateOneById(user.id, {
        newEmail,
        newEmailConfirmationToken,
        newEmailConfirmationLastSentAt: new Date(),
      });

      const updatedUser = await authManager.confirmEmail(newEmailConfirmationToken, true);

      expect(updatedUser.email).toBe(newEmail);
      expect(updatedUser.newEmail).toBe(null);
      expect(updatedUser.newEmailConfirmationToken).toBe(null);
    });

    it('should make sure to confirm only if a new email it set', async () => {
      const user = await authManager.register({
        displayName: 'Tester4',
        username: 'tester4',
        email: 'tester+4@corcosoft.com',
        password: 'password',
      });

      const newEmailConfirmationToken = uuidv4();
      await usersManager.updateOneById(user.id, {
        newEmail: null,
        newEmailConfirmationToken,
        newEmailConfirmationLastSentAt: new Date(),
      });

      const result = () => authManager.confirmEmail(newEmailConfirmationToken, true);

      await expect(result).rejects.toThrow('User does not have a new email set');
    });

    it('should throw an error if token has expired', async () => {
      const user = await authManager.register({
        displayName: 'Tester5',
        username: 'tester5',
        email: 'tester+5@corcosoft.com',
        password: 'password',
      });

      const newEmailConfirmationToken = uuidv4();
      await usersManager.updateOneById(user.id, {
        newEmail: null,
        newEmailConfirmationToken,
        newEmailConfirmationLastSentAt: subHours(new Date(), 8),
      });

      const result = () => authManager.confirmEmail(newEmailConfirmationToken, true);

      await expect(result).rejects.toThrow(
        'Seems like the token already expired. Please try and request it again.'
      );
    });
  });

  describe('cancelNewEmail()', () => {
    it('should throw an error if the user has no new email set', async () => {
      const user = await authManager.register({
        displayName: 'Tester6',
        username: 'tester6',
        email: 'tester+6@corcosoft.com',
        password: 'password',
      });

      const result = () => authManager.cancelNewEmail(user.id);

      await expect(result).rejects.toThrow('User does not have a new email set');
    });

    it('should work correctly', async () => {
      const user = await authManager.register({
        displayName: 'Tester7',
        username: 'tester7',
        email: 'tester+7@corcosoft.com',
        password: 'password',
      });

      const newEmail = 'tester+7newemail@corcosoft.com';
      const newEmailConfirmationToken = uuidv4();
      await usersManager.updateOneById(user.id, {
        newEmail,
        newEmailConfirmationToken,
        newEmailConfirmationLastSentAt: new Date(),
      });

      const updatedUser = await authManager.cancelNewEmail(user.id);

      expect(updatedUser.email).toBe('tester+7@corcosoft.com');
      expect(updatedUser.newEmail).toBe(null);
      expect(updatedUser.newEmailConfirmationToken).toBe(null);
      expect(updatedUser.newEmailConfirmationLastSentAt).toBe(null);
    });
  });

  describe('requestPasswordReset()', () => {
    it('should work correctly', async () => {
      const user = await authManager.register({
        displayName: 'Tester8',
        username: 'tester8',
        email: 'tester+8@corcosoft.com',
        password: 'password',
      });

      const updatedUser = await authManager.requestPasswordReset(user.email);

      expect(updatedUser.passwordResetToken).not.toBe(null);
      expect(updatedUser.passwordResetLastRequestedAt).not.toBe(null);
    });

    it('should not allow requesting a new password reset if one is currently pending', async () => {
      const user = await authManager.register({
        displayName: 'Tester9',
        username: 'tester9',
        email: 'tester+9@corcosoft.com',
        password: 'password',
      });

      const passwordResetLastRequestedAt = subMinutes(new Date(), 5);
      await usersManager.updateOneById(user.id, {
        passwordResetToken: uuidv4(),
        passwordResetLastRequestedAt,
      });

      const result = () => authManager.requestPasswordReset(user.email);

      await expect(result).rejects.toThrow(
        'You already have a pending password reset request. Check your email or try again later.'
      );
    });
  });

  describe('resetPassword()', () => {
    it('should throw an error for invalid reset token', async () => {
      const result = () => authManager.resetPassword('invalid', 'new-password');

      await expect(result).rejects.toThrow('Invalid password reset token');
    });

    it('should work correctly', async () => {
      const user = await authManager.register({
        displayName: 'Tester10',
        username: 'tester10',
        email: 'tester+10@corcosoft.com',
        password: 'password',
      });

      const passwordResetToken = uuidv4();
      await usersManager.updateOneById(user.id, {
        passwordResetToken,
        passwordResetLastRequestedAt: new Date(),
      });

      const updatedUser = await authManager.resetPassword(passwordResetToken, 'new-password');

      expect(updatedUser.password).not.toBe(user.password);
      expect(updatedUser.passwordResetToken).toBe(null);
      expect(updatedUser.passwordResetLastRequestedAt).toBe(null);
    });

    it('should not allow changing the password if token has expired', async () => {
      const user = await authManager.register({
        displayName: 'Tester11',
        username: 'tester11',
        email: 'tester+11@corcosoft.com',
        password: 'password',
      });

      const passwordResetToken = uuidv4();
      await usersManager.updateOneById(user.id, {
        passwordResetToken,
        passwordResetLastRequestedAt: subHours(new Date(), 8),
      });

      const result = () => authManager.resetPassword(passwordResetToken, 'new-password');

      await expect(result).rejects.toThrow(
        'Seems like the token already expired. Please try and request it again.'
      );
    });
  });

  describe('refreshToken()', () => {
    it('should work correctly', async () => {
      const email = 'tester+12@corcosoft.com';
      const password = 'password';
      await authManager.register({
        displayName: 'Tester12',
        username: 'tester12',
        email,
        password,
      });

      const userWithAccessToken = await authManager.login(email, password);

      const refreshedUserWithAccessToken = await authManager.refreshToken(
        userWithAccessToken.userAccessToken.refreshToken
      );

      expect(refreshedUserWithAccessToken.userAccessToken.token).not.toBe(
        userWithAccessToken.userAccessToken.token
      );
    });

    it('should prevent refreshing if it was revoked', async () => {
      const email = 'tester+13@corcosoft.com';
      const password = 'password';
      await authManager.register({
        displayName: 'Tester13',
        username: 'tester13',
        email,
        password,
      });

      const userWithAccessToken = await authManager.login(email, password);

      await userAccessTokensManager.updateOneById(userWithAccessToken.userAccessToken.id, {
        revokedAt: subMinutes(new Date(), 5),
      });

      const result = () =>
        authManager.refreshToken(userWithAccessToken.userAccessToken.refreshToken);

      await expect(result).rejects.toThrow('Token was revoked');
    });

    it('should prevent refreshing if it has expired', async () => {
      const email = 'tester+14@corcosoft.com';
      const password = 'password';
      await authManager.register({
        displayName: 'Tester14',
        username: 'tester14',
        email,
        password,
      });

      const userWithAccessToken = await authManager.login(email, password);

      await userAccessTokensManager.updateOneById(userWithAccessToken.userAccessToken.id, {
        expiresAt: subMinutes(new Date(), 5),
      });

      const result = () =>
        authManager.refreshToken(userWithAccessToken.userAccessToken.refreshToken);

      await expect(result).rejects.toThrow('Token has expired');
    });

    it('should prevent refreshing if it has expired', async () => {
      const email = 'tester+15@corcosoft.com';
      const password = 'password';
      await authManager.register({
        displayName: 'Tester15',
        username: 'tester15',
        email,
        password,
      });

      const userWithAccessToken = await authManager.login(email, password);

      await userAccessTokensManager.updateOneById(userWithAccessToken.userAccessToken.id, {
        refreshTokenClaimedAt: subMinutes(new Date(), 5),
      });

      const result = () =>
        authManager.refreshToken(userWithAccessToken.userAccessToken.refreshToken);

      await expect(result).rejects.toThrow('Token was already claimed');
    });

    it('should create default lists and a calendar for a new user', async () => {
      const email = 'tester+16@corcosoft.com';
      const password = 'password';
      const user = await authManager.register({
        displayName: 'Tester16',
        username: 'tester16',
        email,
        password,
      });

      const lists = await listsManager.findManyByUserId(user.id);
      const calendars = await calendarsManager.findManyByUserId(user.id);

      expect(lists.length).toBe(LISTS_DEFAULT_NAMES.length);
      expect(calendars.length).toBe(1);
    });
  });

  describe('update()', () => {
    it('should work correctly', async () => {
      const user = await authManager.register({
        displayName: 'Tester17',
        username: 'tester17',
        email: 'tester+17@corcosoft.com',
        password: 'password',
      });

      const updatedUser = await authManager.update(user.id, {
        displayName: 'Tester17Updated',
        birthDate: '1990-01-01',
        email: 'tester+17updated@corcosoft.com',
      });

      expect(updatedUser.displayName).toBe('Tester17Updated');
      expect(updatedUser.birthDate).toStrictEqual('1990-01-01');
      expect(updatedUser.email).toBe('tester+17@corcosoft.com');
      expect(updatedUser.newEmail).toBe('tester+17updated@corcosoft.com');
      expect(updatedUser.newEmailConfirmationToken).not.toBe(null);
      expect(updatedUser.newEmailConfirmationLastSentAt).not.toBe(null);
    });
  });

  describe('updatePassword()', () => {
    it('should work correctly', async () => {
      const user = await authManager.register({
        displayName: 'Tester18',
        username: 'tester18',
        email: 'tester+18@corcosoft.com',
        password: 'password',
      });

      const updatedUser = await authManager.updatePassword(user.id, 'new-password', 'password');

      expect(updatedUser.password).not.toBe(user.password);
    });

    it('should throw error if password is not provided', async () => {
      const user = await authManager.register({
        displayName: 'Tester19',
        username: 'tester19',
        email: 'tester+19@corcosoft.com',
        password: 'password',
      });

      const result = () => authManager.updatePassword(user.id, '', 'password');

      await expect(result).rejects.toThrow(
        JSON.stringify(
          [
            {
              code: 'too_small',
              minimum: 8,
              type: 'string',
              inclusive: true,
              exact: false,
              message: 'Password must be at least 8 characters long',
              path: [],
            },
          ],
          null,
          2
        )
      );
    });

    it('should throw error if password is too short', async () => {
      const user = await authManager.register({
        displayName: 'Tester20',
        username: 'tester20',
        email: 'tester+20@corcosoft.com',
        password: 'password',
      });

      const result = () => authManager.updatePassword(user.id, 'short', 'password');

      await expect(result).rejects.toThrow(
        JSON.stringify(
          [
            {
              code: 'too_small',
              minimum: 8,
              type: 'string',
              inclusive: true,
              exact: false,
              message: 'Password must be at least 8 characters long',
              path: [],
            },
          ],
          null,
          2
        )
      );
    });
  });
});
