/// <reference types="vitest" />

import { INestApplication } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { APP_VERSION, APP_VERSION_HEADER } from '@moaitime/shared-common';

import { AppModule } from '../app.module';

describe('AppController (e2e)', () => {
  const APP_VERSION_HEADER_KEY = APP_VERSION_HEADER.toLocaleLowerCase();

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new WsAdapter(app));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(({ headers }) => {
        expect(headers[APP_VERSION_HEADER_KEY]).toBe(APP_VERSION);
      })
      .expect({ hello: 'world' });
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(({ headers }) => {
        expect(headers[APP_VERSION_HEADER_KEY]).toBe(APP_VERSION);
      })
      .expect({ status: 'ok' });
  });
});
