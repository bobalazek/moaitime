/// <reference types="vitest" />

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { User, UserAccessToken } from '@moaitime/database-core';
import { authManager, usersManager } from '@moaitime/database-services';
import { reloadDatabase } from '@moaitime/database-testing';

import { AuthModule } from '../auth.module';
import { getTestUser, getTestUserAccessToken } from '../utils/auth.test-data';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let testUser: User;
  let testUserAccessToken: UserAccessToken;

  beforeAll(async () => {
    await reloadDatabase();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    testUser = await getTestUser();
    testUserAccessToken = getTestUserAccessToken(testUser);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/auth/login (POST)', async () => {
    vi.spyOn(usersManager, 'findOneByEmail').mockResolvedValue(testUser);
    vi.spyOn(authManager, 'createNewUserAccessToken').mockResolvedValue(testUserAccessToken);

    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: 'test',
      })
      .expect(({ statusCode }) => {
        expect(statusCode).toBe(200);
      });
  });
});
