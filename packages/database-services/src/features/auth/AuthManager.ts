import { addSeconds } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { NewUser, User, UserAccessToken } from '@myzenbuddy/database-core';
import {
  AUTH_EMAIL_CONFIRMATION_REQUEST_EXPIRATION_SECONDS,
  AUTH_PASSWORD_RESET_REQUEST_EXPIRATION_SECONDS,
  compareHash,
  generateHash,
} from '@myzenbuddy/shared-backend';
import { UserRoleEnum } from '@myzenbuddy/shared-common';

import { UsersManager, usersManager } from '../users';
import { UserAccessTokensManager, userAccessTokensManager } from '../users/UserAccessTokensManager';

type AuthLoginResult = {
  user: User;
  userAccessToken: UserAccessToken;
};

export class AuthManager {
  constructor(
    private _usersManager: UsersManager,
    private _userAccessTokensManager: UserAccessTokensManager
  ) {}

  async login(email: string, password: string): Promise<AuthLoginResult> {
    const user = await this.getUserByCredentials(email, password);
    const userAccessToken = await this.createNewUserAccessToken(user.id);

    return {
      user,
      userAccessToken,
    };
  }

  async logout(token: string): Promise<boolean> {
    const userAccessToken = await this._userAccessTokensManager.findOneByToken(token);
    if (!userAccessToken) {
      return false;
    }

    const now = new Date();

    await this._userAccessTokensManager.updateOneById(userAccessToken.id, {
      revokedAt: now,
      expiresAt: now,
    });

    return true;
  }

  async register(data: NewUser): Promise<User> {
    const existingUser = await this._usersManager.findOneByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const { password, ...user } = data;
    if (!password) {
      throw new Error('Password is not set');
    }

    const hashedPassword = await this.validateAndHashPassword(password);

    const newUser = await this._usersManager.insertOne({
      ...user,
      password: hashedPassword,
      roles: [UserRoleEnum.USER],
      emailConfirmationToken: uuidv4(),
      emailConfirmationLastSentAt: new Date(),
    } as NewUser);

    return newUser;
  }

  async confirmEmail(emailConfirmationToken: string, isNewEmail = false): Promise<User> {
    const user = isNewEmail
      ? await this._usersManager.findOneByNewEmailConfirmationToken(emailConfirmationToken)
      : await this._usersManager.findOneByEmailConfirmationToken(emailConfirmationToken);
    if (!user) {
      throw new Error('Invalid email confirmation token');
    }

    if (!isNewEmail && user.emailConfirmedAt) {
      throw new Error(`Email already confirmed`);
    }

    const now = new Date();
    const lastSentAt = isNewEmail
      ? user.newEmailConfirmationLastSentAt
      : user.emailConfirmationLastSentAt;
    const expiresAt = lastSentAt
      ? addSeconds(lastSentAt, AUTH_EMAIL_CONFIRMATION_REQUEST_EXPIRATION_SECONDS)
      : null;

    if (!expiresAt || (expiresAt && expiresAt.getTime() < now.getTime())) {
      throw new Error(`Seems like the token already expired. Please try and request it again.`);
    }

    const updateData: Partial<NewUser> = {
      emailConfirmedAt: new Date(),
    };

    if (isNewEmail) {
      if (!user.newEmail) {
        throw new Error(`User does not have a new email set`);
      }

      updateData.email = user.newEmail;
      updateData.newEmail = null;
      updateData.newEmailConfirmationToken = null;
    } else {
      updateData.emailConfirmationToken = null;
    }

    const updatedUser = await this._usersManager.updateOneById(user.id, updateData);

    // TODO: send success emails

    return updatedUser;
  }

  async resendEmailConfirmation(id: string, isNewEmail = false): Promise<User> {
    const user = await this._usersManager.findOneById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (isNewEmail && !user.newEmail) {
      throw new Error(`User does not have a new email`);
    }

    const now = new Date();
    const lastSentAt = isNewEmail
      ? user.newEmailConfirmationLastSentAt
      : user.emailConfirmationLastSentAt;
    const expiresAt = lastSentAt
      ? addSeconds(lastSentAt, AUTH_EMAIL_CONFIRMATION_REQUEST_EXPIRATION_SECONDS)
      : null;
    if (expiresAt && expiresAt.getTime() > now.getTime()) {
      throw new Error(
        `You already have a pending new email confirmation request. Check your email or try again later.`
      );
    }

    const updateData: Partial<NewUser> = {};

    if (isNewEmail) {
      updateData.newEmailConfirmationToken = uuidv4();
      updateData.newEmailConfirmationLastSentAt = now;
    } else {
      updateData.emailConfirmationToken = uuidv4();
      updateData.emailConfirmationLastSentAt = now;
    }

    const updatedUser = await this._usersManager.updateOneById(user.id, updateData);

    // TODO: send new email confirmation

    return updatedUser;
  }

  async cancelNewEmailConfirmation(id: string): Promise<User> {
    const user = await this._usersManager.findOneById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.newEmail) {
      throw new Error(`User does not have a new email set`);
    }

    const updatedUser = await this._usersManager.updateOneById(user.id, {
      newEmail: null,
      newEmailConfirmationToken: null,
      newEmailConfirmationLastSentAt: null,
    });

    return updatedUser;
  }

  async requestPasswordReset(email: string): Promise<User> {
    const user = await this._usersManager.findOneByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const now = new Date();
    const expiresAt = user.passwordResetLastRequestedAt
      ? addSeconds(
          user.passwordResetLastRequestedAt,
          AUTH_PASSWORD_RESET_REQUEST_EXPIRATION_SECONDS
        )
      : null;

    if (expiresAt && expiresAt.getTime() > now.getTime()) {
      throw new Error(
        `You already have a pending password reset request. Check your email or try again later.`
      );
    }

    const updatedUser = await this._usersManager.updateOneById(user.id, {
      passwordResetToken: uuidv4(),
      passwordResetLastRequestedAt: now,
    });

    // TODO: send email

    return updatedUser;
  }

  async resetPassword(passwordResetToken: string, password: string): Promise<User> {
    const user = await this._usersManager.findOneByPasswordResetToken(passwordResetToken);
    if (!user) {
      throw new Error('Invalid password reset token');
    }

    const now = new Date();
    const expiresAt = user.passwordResetLastRequestedAt
      ? addSeconds(
          user.passwordResetLastRequestedAt,
          AUTH_PASSWORD_RESET_REQUEST_EXPIRATION_SECONDS
        )
      : null;

    if (!expiresAt || (expiresAt && expiresAt.getTime() < now.getTime())) {
      throw new Error(`Seems like the token already expired. Please try and request it again.`);
    }

    const hashedPassword = await this.validateAndHashPassword(password);
    const updatedUser = await this._usersManager.updateOneById(user.id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetLastRequestedAt: null,
    });

    // TODO: send password reset confirmation

    return updatedUser;
  }

  async refreshToken(refreshToken: string): Promise<AuthLoginResult> {
    const userAccessToken = await this._userAccessTokensManager.findOneByRefreshToken(refreshToken);
    if (!userAccessToken) {
      throw new Error('Invalid refresh token');
    }

    const now = new Date();

    if (userAccessToken.revokedAt && userAccessToken.revokedAt.getTime() < now.getTime()) {
      throw new Error('Token was revoked');
    }

    if (userAccessToken.expiresAt && userAccessToken.expiresAt.getTime() < now.getTime()) {
      throw new Error('Token has expired');
    }

    if (
      userAccessToken.refreshTokenClaimedAt &&
      userAccessToken.refreshTokenClaimedAt.getTime() < now.getTime()
    ) {
      throw new Error('Token was already claimed');
    }

    await this._userAccessTokensManager.updateOneById(userAccessToken.id, {
      refreshTokenClaimedAt: now,
    });

    const newUserAccessToken = await this.createNewUserAccessToken(userAccessToken.userId);

    return {
      user: userAccessToken.user,
      userAccessToken: newUserAccessToken,
    };
  }

  async update(id: string, data: Partial<NewUser>): Promise<User> {
    const user = await this._usersManager.findOneById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (data.password) {
      throw new Error('Cannot update password');
    }

    const updateData: Partial<NewUser> = {};
    let isEmailChanged = false;

    if (typeof data.displayName !== 'undefined' && data.displayName !== user.displayName) {
      updateData.displayName = data.displayName;
    }

    if (typeof data.email !== 'undefined' && data.email !== user.email) {
      const existingUser = await this._usersManager.findOneByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error('User with this email address already exists');
      }

      updateData.newEmail = data.email;
      updateData.newEmailConfirmationToken = uuidv4();
      updateData.newEmailConfirmationLastSentAt = new Date();

      isEmailChanged = true;
    }

    if (typeof data.birthDate !== 'undefined' && data.birthDate !== user.birthDate) {
      updateData.birthDate = data.birthDate;
    }

    if (Object.keys(updateData).length === 0) {
      return user;
    }

    const updatedUser = await this._usersManager.updateOneById(id, updateData);

    if (isEmailChanged) {
      // TODO: if email changed, send email confirmation
    }

    return updatedUser;
  }

  async updatePassword(id: string, newPassword: string, currentPassword?: string): Promise<User> {
    const user = await this._usersManager.findOneById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.password && !currentPassword) {
      throw new Error('You must provide your current password');
    }

    // TODO
    // Figure out how to handle users without password,
    // like those that registered with OAuth.
    // Not an issue right now, as we won't have that yet,
    // but we will need to figure once we are there.

    const isPasswordSame =
      currentPassword && user.password
        ? await this.comparePassword(currentPassword, user.password)
        : true;
    if (!isPasswordSame) {
      throw new Error('Invalid password provided');
    }

    const hashedPassword = await this.validateAndHashPassword(newPassword);

    const updatedUser = await this._usersManager.updateOneById(id, {
      password: hashedPassword,
    });

    // TODO: send password changed email

    return updatedUser;
  }

  async getUserByCredentials(email: string, password: string): Promise<User> {
    const user = await this._usersManager.findOneByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.password) {
      throw new Error('This user has no password set');
    }

    const isPasswordSame = await this.comparePassword(password, user.password);
    if (!isPasswordSame) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  async getUserByAccessToken(
    token: string
  ): Promise<{ user: User; userAccessToken: UserAccessToken } | null> {
    const userAccessToken = await this._userAccessTokensManager.findOneByToken(token);
    if (!userAccessToken) {
      throw new Error('Invalid credentials');
    }

    const user = await this._usersManager.findOneById(userAccessToken.userId);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    return { user, userAccessToken };
  }

  async createNewUserAccessToken(userId: string): Promise<UserAccessToken> {
    const userAccessToken = await this._userAccessTokensManager.insertOne({
      userId,
      token: uuidv4(),
      refreshToken: uuidv4(),
    });

    return userAccessToken;
  }

  async validateAndHashPassword(rawPassword: string): Promise<string> {
    return this.hashPassword(rawPassword);
  }

  async hashPassword(rawPassword: string): Promise<string> {
    return generateHash(rawPassword);
  }

  async comparePassword(rawPassword: string, hashedPassword: string): Promise<boolean> {
    return compareHash(rawPassword, hashedPassword);
  }
}

export const authManager = new AuthManager(usersManager, userAccessTokensManager);
