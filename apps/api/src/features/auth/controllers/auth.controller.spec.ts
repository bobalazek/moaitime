/// <reference types="vitest" />

import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';

import { User, UserAccessToken } from '@moaitime/database-core';
import { authManager, usersManager } from '@moaitime/database-services';
import { DEFAULT_USER_SETTINGS } from '@moaitime/shared-common';

import { getTestUser, getTestUserAccessToken } from '../utils/auth.test-data';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let response: Response;
  let request: Request;
  let app: TestingModule;
  let authController: AuthController;
  let testUser: User;
  let testUserAccessToken: UserAccessToken;

  beforeAll(async () => {
    response = {
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;
    request = {
      query: {},
      headers: {},
      get: vi.fn(),
    } as Request;

    app = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [],
    }).compile();

    authController = app.get<AuthController>(AuthController);

    testUser = await getTestUser();
    testUserAccessToken = getTestUserAccessToken(testUser);
  });

  describe('login', () => {
    it('should check that we get an error when no user exists', async () => {
      vi.spyOn(usersManager, 'findOneByEmail').mockResolvedValue(null);

      const result = () =>
        authController.login(
          {
            email: 'test@test.com',
            password: 'test',
          },
          '127.0.0.1',
          request,
          response
        );

      await expect(result).rejects.toThrow('Invalid credentials');
    });

    it('should check that we get the same error if the password is incorrect', async () => {
      vi.spyOn(usersManager, 'findOneByEmail').mockResolvedValue(testUser);

      const result = () =>
        authController.login(
          {
            email: 'test@email.com',
            password: 'wrong-password',
          },
          '127.0.0.1',
          request,
          response
        );

      await expect(result).rejects.toThrow('Invalid credentials');
    });

    it('should return the user and access token correctly', async () => {
      vi.spyOn(usersManager, 'findOneByEmail').mockResolvedValue(testUser);
      vi.spyOn(authManager, 'createNewUserAccessToken').mockResolvedValue(testUserAccessToken);

      const { success, data } = await authController.login(
        {
          email: 'test@email.com',
          password: 'test',
        },
        '127.0.0.1',
        request,
        response
      );

      expect(success).toBe(true);
      expect(data?.user).toEqual({
        id: testUser.id,
        displayName: testUser.displayName,
        username: testUser.username,
        email: testUser.email,
        newEmail: testUser.newEmail,
        roles: testUser.roles,
        settings: DEFAULT_USER_SETTINGS,
        avatarImageUrl: null,
        biography: null,
        isPrivate: false,
        userIdentities: [],
        hasPassword: true,
        birthDate: '1990-01-01',
        emailConfirmedAt: testUser.emailConfirmedAt?.toISOString() ?? null,
        createdAt: testUser.createdAt?.toISOString() ?? null,
        updatedAt: testUser.updatedAt?.toISOString() ?? null,
      });
      expect(data?.userAccessToken).toEqual({
        token: testUserAccessToken.token,
        refreshToken: testUserAccessToken.refreshToken,
        expiresAt: null,
        deviceUid: null,
      });
    });
  });
});
