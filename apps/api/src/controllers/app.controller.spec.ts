/// <reference types="vitest" />

import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('index', () => {
    it('should correctly return hello world', async () => {
      const result = await appController.index();

      expect(result).toStrictEqual({ hello: 'world' });
    });
  });

  describe('health', () => {
    it('should return status ok', async () => {
      const result = await appController.health();

      expect(result).toStrictEqual({ status: 'ok' });
    });
  });
});
