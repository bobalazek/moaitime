import { writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

import { addSeconds } from 'date-fns';
import { UAParser } from 'ua-parser-js';
import { v4 as uuidv4 } from 'uuid';

import { NewUser, User, UserAccessToken } from '@moaitime/database-core';
import { mailer } from '@moaitime/emails-mailer';
import { globalEventsNotifier } from '@moaitime/global-events-notifier';
import {
  AUTH_DATA_EXPORT_REQUEST_EXPIRATION_SECONDS,
  AUTH_DELETION_REQUEST_EXPIRATION_SECONDS,
  AUTH_EMAIL_CONFIRMATION_REQUEST_EXPIRATION_SECONDS,
  AUTH_PASSWORD_RESET_REQUEST_EXPIRATION_SECONDS,
  compareHash,
  generateHash,
  getEnv,
  LISTS_DEFAULT_NAMES,
  TASKS_DEFAULT_ENTRIES,
} from '@moaitime/shared-backend';
import {
  getDomainFromUrl,
  GlobalEventsEnum,
  MAIN_COLORS,
  ProcessingStatusEnum,
  UserPasswordSchema,
  UserRoleEnum,
  UserSettingsSchema,
  WEB_URL,
} from '@moaitime/shared-common';
import { uploader } from '@moaitime/uploader';

import { CalendarsManager, calendarsManager } from '../calendars/CalendarsManager';
import { ListsManager, listsManager } from '../tasks/ListsManager';
import { TasksManager, tasksManager } from '../tasks/TasksManager';
import { UserAccessTokensManager, userAccessTokensManager } from './UserAccessTokensManager';
import { UserDataExportsManager, userDataExportsManager } from './UserDataExportsManager';
import { UsersManager, usersManager } from './UsersManager';

type AuthLoginResult = {
  user: User;
  userAccessToken: UserAccessToken;
};

export class AuthManager {
  constructor(
    private _usersManager: UsersManager,
    private _userAccessTokensManager: UserAccessTokensManager,
    private _userExportsManager: UserDataExportsManager,
    private _listsManager: ListsManager,
    private _tasksManager: TasksManager,
    private _calendarsManager: CalendarsManager
  ) {}

  // Login
  async login(
    email: string,
    password: string,
    userAgent?: string,
    deviceUid?: string
  ): Promise<AuthLoginResult> {
    const user = await this.getUserByCredentials(email, password);
    const userAccessToken = await this.createNewUserAccessToken(user.id, userAgent, deviceUid);

    globalEventsNotifier.publish(GlobalEventsEnum.AUTH_USER_LOGGED_IN, {
      userId: user.id,
    });

    return {
      user,
      userAccessToken,
    };
  }

  async logout(token: string, revokedReason?: string): Promise<boolean> {
    const userAccessToken = await this._userAccessTokensManager.findOneByToken(token);
    if (!userAccessToken) {
      return false;
    }

    const now = new Date();

    await this._userAccessTokensManager.updateOneById(userAccessToken.id, {
      revokedAt: now,
      expiresAt: now,
      revokedReason,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.AUTH_USER_LOGGED_OUT, {
      userId: userAccessToken.userId,
    });

    return true;
  }

  // Register
  async register(data: NewUser): Promise<User> {
    const { password, ...user } = data;
    if (!password) {
      throw new Error('Password is not set');
    }

    UserPasswordSchema.parse(password);

    const existingUserEmail = await this._usersManager.findOneByEmail(data.email);
    if (existingUserEmail) {
      throw new Error('User with this email already exists');
    }

    const existingUserUsername = await this._usersManager.findOneByUsername(data.username);
    if (existingUserUsername) {
      throw new Error('User with this username already exists');
    }

    const hashedPassword = await this.validateAndHashPassword(password);

    const newUser = await this._usersManager.insertOne({
      ...user,
      password: hashedPassword,
      roles: [UserRoleEnum.USER],
      emailConfirmationToken: uuidv4(),
      emailConfirmationLastSentAt: new Date(),
    } as NewUser);

    for (let i = 0; i < LISTS_DEFAULT_NAMES.length; i++) {
      const name = LISTS_DEFAULT_NAMES[i] as keyof typeof TASKS_DEFAULT_ENTRIES;
      const color = MAIN_COLORS[i % MAIN_COLORS.length].value;

      const newList = await this._listsManager.insertOne({
        name,
        color,
        userId: newUser.id,
      });

      const defaultTasks = TASKS_DEFAULT_ENTRIES[name] ?? [];
      for (let j = 0; j < defaultTasks.length; j++) {
        await this._tasksManager.insertOne({
          name: defaultTasks[j],
          listId: newList.id,
          userId: newUser.id,
        });
      }
    }

    const userSetings = this._usersManager.getUserSettings(newUser);

    await this._calendarsManager.insertOne({
      name: `📅 ${newUser.displayName}'s Calendar`,
      userId: newUser.id,
      timezone: userSetings.generalTimezone,
    });

    // Only the MySpace generation will get this reference.
    const userBorut = await this._usersManager.findOneByUsername('bobalazek');
    if (userBorut) {
      try {
        await this._usersManager.follow(userBorut.id, newUser.id);
      } catch (error) {
        // Well then, keep your secrets
      }

      try {
        await this._usersManager.follow(newUser.id, userBorut.id);
      } catch (error) {
        // Well then, keep your secrets
      }
    }

    globalEventsNotifier.publish(GlobalEventsEnum.AUTH_USER_REGISTERED, {
      userId: newUser.id,
    });

    await mailer.sendAuthWelcomeEmail({
      userEmail: newUser.email,
      userDisplayName: newUser.displayName,
      confirmEmailUrl: `${WEB_URL}/confirm-email?token=${newUser.emailConfirmationToken}`,
    });

    return newUser;
  }

  // Email confirmation
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

    return updatedUser;
  }

  async resendEmailConfirmation(userId: string, isNewEmail = false): Promise<User> {
    const user = await this._usersManager.findOneById(userId);
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

    if (isNewEmail) {
      await mailer.sendAuthConfirmNewEmailEmail({
        userEmail: updatedUser.newEmail as string,
        userDisplayName: updatedUser.displayName,
        confirmEmailUrl: `${WEB_URL}/confirm-email?token=${updatedUser.newEmailConfirmationToken}&isNewEmail=true`,
      });
    } else {
      await mailer.sendAuthConfirmEmailEmail({
        userEmail: updatedUser.email,
        userDisplayName: updatedUser.displayName,
        confirmEmailUrl: `${WEB_URL}/confirm-email?token=${updatedUser.emailConfirmationToken}`,
      });
    }

    return updatedUser;
  }

  async cancelNewEmail(userId: string): Promise<User> {
    const user = await this._usersManager.findOneById(userId);
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

  // Password reset
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

    await mailer.sendAuthResetPasswordEmail({
      userEmail: updatedUser.email,
      userDisplayName: updatedUser.displayName,
      resetPasswordUrl: `${WEB_URL}/reset-password?token=${updatedUser.passwordResetToken}`,
    });

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

    UserPasswordSchema.parse(password);

    const hashedPassword = await this.validateAndHashPassword(password);
    const updatedUser = await this._usersManager.updateOneById(user.id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetLastRequestedAt: null,
    });

    return updatedUser;
  }

  // Data export
  async requestDataExport(userId: string): Promise<User> {
    const user = await this._usersManager.findOneById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const lastUserDataExport = await this._userExportsManager.findOneLatestByUserId(user.id);

    const now = new Date();
    const expiresAt = lastUserDataExport
      ? addSeconds(lastUserDataExport.createdAt!, AUTH_DATA_EXPORT_REQUEST_EXPIRATION_SECONDS)
      : null;

    if (expiresAt && expiresAt.getTime() > now.getTime()) {
      throw new Error(
        `You already have a requested a data export recently. Please wait for it to finish and then check your email or try again later.`
      );
    }

    await this._userExportsManager.insertOne({
      processingStatus: ProcessingStatusEnum.PENDING,
      userId: user.id,
    });

    return user;
  }

  // Account deletion
  async requestAccountDeletion(userId: string): Promise<User> {
    const user = await this._usersManager.findOneById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const now = new Date();
    const expiresAt = user.deletionRequestedAt
      ? addSeconds(user.deletionRequestedAt, AUTH_DELETION_REQUEST_EXPIRATION_SECONDS)
      : null;

    if (expiresAt && expiresAt.getTime() > now.getTime()) {
      throw new Error(
        `You already have a pending account deletion request. Check your email or try again later.`
      );
    }

    const updatedUser = await this._usersManager.updateOneById(user.id, {
      deletionToken: uuidv4(),
      deletionRequestedAt: now,
    });

    await mailer.sendAuthAccountDeletionEmail({
      userEmail: updatedUser.email,
      userDisplayName: updatedUser.displayName,
      deleteAccountUrl: `${WEB_URL}/delete-account?token=${updatedUser.deletionToken}`,
    });

    return updatedUser;
  }

  async deleteAccount(deletionToken: string): Promise<User> {
    const user = await this._usersManager.findOneByDeletionToken(deletionToken);
    if (!user) {
      throw new Error('Invalid deletion token');
    }

    const now = new Date();
    const expiresAt = user.deletionRequestedAt
      ? addSeconds(user.deletionRequestedAt, AUTH_DELETION_REQUEST_EXPIRATION_SECONDS)
      : null;

    if (!expiresAt || (expiresAt && expiresAt.getTime() < now.getTime())) {
      throw new Error(`Seems like the token already expired. Please try and request it again.`);
    }

    const updatedUser = await this._usersManager.updateOneById(user.id, {
      email: `${user.id}@deleted-user`,
      beforeDeletionEmail: user.email,
      deletionToken: null,
      deletionRequestedAt: null,
      deletedAt: now,
    });

    await this._userAccessTokensManager.updateOneById(updatedUser.id, {
      revokedAt: now,
      expiresAt: now,
    });

    return updatedUser;
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<AuthLoginResult> {
    const userAccessToken = await this._userAccessTokensManager.findOneByRefreshToken(refreshToken);
    if (!userAccessToken) {
      throw new Error('Invalid refresh token');
    }

    const now = new Date();

    if (userAccessToken.revokedAt && userAccessToken.revokedAt.getTime() < now.getTime()) {
      throw new Error(
        userAccessToken.revokedReason
          ? `Token was revoked because: "${userAccessToken.revokedReason}"`
          : 'Token was revoked'
      );
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

  // Settings
  async update(userId: string, data: Partial<NewUser>): Promise<User> {
    const user = await this._usersManager.findOneById(userId);
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

    if (typeof data.username !== 'undefined' && data.username !== user.username) {
      const existingUser = await this._usersManager.findOneByUsername(data.username);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('User with this username already exists');
      }

      updateData.username = data.username;
    }

    if (
      typeof data.email !== 'undefined' &&
      data.email !== user.email &&
      data.email !== user.newEmail
    ) {
      const existingUser = await this._usersManager.findOneByEmail(data.email);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('User with this email address already exists');
      }

      updateData.newEmail = data.email;
      updateData.newEmailConfirmationToken = uuidv4();
      updateData.newEmailConfirmationLastSentAt = new Date();

      isEmailChanged = true;
    }

    if (typeof data.biography !== 'undefined' && data.biography !== user.biography) {
      updateData.biography = data.biography;
    }

    if (typeof data.birthDate !== 'undefined' && data.birthDate !== user.birthDate) {
      updateData.birthDate = data.birthDate;
    }

    if (typeof data.isPrivate !== 'undefined' && data.isPrivate !== user.isPrivate) {
      updateData.isPrivate = data.isPrivate;
    }

    if (Object.keys(updateData).length === 0) {
      return user;
    }

    const updatedUser = await this._usersManager.updateOneById(userId, updateData);

    if (isEmailChanged) {
      await mailer.sendAuthConfirmNewEmailEmail({
        userEmail: updatedUser.newEmail as string,
        userDisplayName: updatedUser.displayName,
        confirmEmailUrl: `${WEB_URL}/confirm-email?token=${updatedUser.newEmailConfirmationToken}&isNewEmail=true`,
      });
    }

    globalEventsNotifier.publish(GlobalEventsEnum.AUTH_USER_UPDATED, {
      userId,
    });

    return updatedUser;
  }

  async updatePassword(
    userId: string,
    newPassword: string,
    currentPassword?: string
  ): Promise<User> {
    UserPasswordSchema.parse(newPassword);

    const user = await this._usersManager.findOneById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.password && !currentPassword) {
      throw new Error('You must provide your current password');
    }

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

    const updatedUser = await this._usersManager.updateOneById(userId, {
      password: hashedPassword,
    });

    await mailer.sendAuthPasswordChangedEmail({
      userEmail: updatedUser.email,
      userDisplayName: updatedUser.displayName,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.AUTH_USER_UPDATED, {
      userId,
    });

    return updatedUser;
  }

  async updateSettings(userId: string, data: Partial<NewUser['settings']>): Promise<User> {
    const user = await this._usersManager.findOneById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const userSetings = this._usersManager.getUserSettings(user);

    const settings = {
      ...userSetings,
      ...data,
    };

    UserSettingsSchema.parse(settings);

    const updatedUser = await this._usersManager.updateOneById(userId, {
      settings,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.AUTH_USER_UPDATED, {
      userId,
    });

    return updatedUser;
  }

  async uploadAvatar(
    userId: string,
    file: { originalname: string; mimetype: string; buffer: Buffer }
  ): Promise<User> {
    const user = await this._usersManager.findOneById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const existingAvatarImageUrl = user.avatarImageUrl;

    const { USER_AVATARS_BUCKET_URL } = getEnv();

    const tmpPath = join(tmpdir(), `${userId}-${file.originalname}`);

    await writeFile(tmpPath, file.buffer);

    const fileName = `${userId}-${Date.now()}.${file.originalname.split('.').pop()}`;
    const avatarImageUrl = await uploader.uploadToBucket(
      USER_AVATARS_BUCKET_URL,
      tmpPath,
      file.mimetype,
      fileName,
      undefined,
      true
    );

    const updatedUser = await this._usersManager.updateOneById(userId, {
      avatarImageUrl,
    });

    // Remove existing
    if (existingAvatarImageUrl) {
      const bucketUrl = getDomainFromUrl(USER_AVATARS_BUCKET_URL);
      const avatarUrl = getDomainFromUrl(existingAvatarImageUrl);
      if (existingAvatarImageUrl && bucketUrl === avatarUrl) {
        const key = existingAvatarImageUrl.split('/').pop() as string;
        await uploader.removeFileFromBucket(USER_AVATARS_BUCKET_URL, key);
      }
    }

    globalEventsNotifier.publish(GlobalEventsEnum.AUTH_USER_UPDATED, {
      userId,
    });

    return updatedUser;
  }

  async deleteAvatar(userId: string): Promise<User> {
    const user = await this._usersManager.findOneById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.avatarImageUrl) {
      throw new Error('User has no avatar');
    }

    const updatedUser = await this._usersManager.updateOneById(userId, {
      avatarImageUrl: null,
    });

    // Remove existing
    const { USER_AVATARS_BUCKET_URL } = getEnv();
    const bucketUrl = getDomainFromUrl(USER_AVATARS_BUCKET_URL);
    const avatarUrl = getDomainFromUrl(user.avatarImageUrl);
    if (bucketUrl === avatarUrl) {
      const key = user.avatarImageUrl.split('/').pop() as string;
      await uploader.removeFileFromBucket(USER_AVATARS_BUCKET_URL, key);
    }

    globalEventsNotifier.publish(GlobalEventsEnum.AUTH_USER_UPDATED, {
      userId,
    });

    return updatedUser;
  }

  // Helpers
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

  async createNewUserAccessToken(
    userId: string,
    userAgent?: string,
    deviceUid?: string
  ): Promise<UserAccessToken> {
    const token = uuidv4();
    const refreshToken = uuidv4();
    let userAgentParsed = null;
    if (userAgent) {
      const parser = new UAParser(userAgent);
      userAgentParsed = parser.getResult();
    }

    const userAccessToken = await this._userAccessTokensManager.insertOne({
      userId,
      token,
      refreshToken,
      userAgent,
      userAgentParsed,
      deviceUid,
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

export const authManager = new AuthManager(
  usersManager,
  userAccessTokensManager,
  userDataExportsManager,
  listsManager,
  tasksManager,
  calendarsManager
);
