/// <reference types="vitest" />

import { FocusSession } from '@moaitime/database-core';
import { reloadDatabase } from '@moaitime/database-testing';
import {
  FocusSessionEventTypeEnum,
  FocusSessionStageEnum,
  FocusSessionStatusEnum,
  FocusSessionUpdateActionEnum,
} from '@moaitime/shared-common';

import { usersManager } from '../auth/UsersManager';
import { focusSessionsManager } from './FocusSessionsManager';

describe('FocusSessionManager.ts', () => {
  let initialFocusSession: FocusSession;
  let initialFocusSessionOneIteration: FocusSession;

  beforeEach(async () => {
    await reloadDatabase();

    const user = await usersManager.insertOne({
      displayName: 'test',
      username: 'focussessiontest',
      email: 'focussessiontest@test.com',
      password: 'test',
    });

    const data = {
      taskText: 'test task',
      status: FocusSessionStatusEnum.ACTIVE,
      stage: FocusSessionStageEnum.FOCUS,
      stageIteration: 1,
      settings: {
        focusDurationSeconds: 60,
        shortBreakDurationSeconds: 60,
        longBreakDurationSeconds: 60,
        focusRepetitionsCount: 2,
      },
      createdAt: new Date('2020-01-01T00:00:00.000Z'),
      updatedAt: new Date('2020-01-01T00:00:00.000Z'),
      userId: user.id,
    };

    initialFocusSession = await focusSessionsManager.insertOne(data);
    initialFocusSessionOneIteration = await focusSessionsManager.insertOne({
      ...data,
      settings: {
        ...data.settings,
        focusRepetitionsCount: 1,
      },
    });
  });

  describe('update()', () => {
    it('should not be able to pause if it is not currently active', async () => {
      initialFocusSession = await focusSessionsManager.updateOneById(initialFocusSession.id, {
        status: FocusSessionStatusEnum.PAUSED,
      });

      const result = () =>
        focusSessionsManager.updateFocusSession(
          initialFocusSession.userId,
          initialFocusSession,
          FocusSessionUpdateActionEnum.PAUSE
        );

      await expect(result).rejects.toThrow('Focus session is not active, so it can not be paused');
    });

    it('should not continue if it is already active', async () => {
      const result = () =>
        focusSessionsManager.updateFocusSession(
          initialFocusSession.userId,
          initialFocusSession,
          FocusSessionUpdateActionEnum.CONTINUE
        );

      await expect(result).rejects.toThrow(
        'Focus session is not paused, so it can not be continued'
      );
    });

    it('should not allow update if already complete', async () => {
      initialFocusSession = await focusSessionsManager.updateOneById(initialFocusSession.id, {
        completedAt: new Date(),
      });

      const result = () =>
        focusSessionsManager.updateFocusSession(
          initialFocusSession.userId,
          initialFocusSession,
          FocusSessionUpdateActionEnum.PING
        );

      await expect(result).rejects.toThrow('Focus session is already completed');
    });

    it('should pause and save the active seconds correctly', async () => {
      vitest.setSystemTime(new Date('2020-01-01T00:00:30.000Z'));

      const newFocusSession = await focusSessionsManager.updateFocusSession(
        initialFocusSession.userId,
        initialFocusSession,
        FocusSessionUpdateActionEnum.PAUSE
      );

      expect(newFocusSession.status).to.be.equal(FocusSessionStatusEnum.PAUSED);
      expect(newFocusSession.stage).to.be.equal(FocusSessionStageEnum.FOCUS);
      expect(newFocusSession.stageProgressSeconds).to.be.equal(30);
      expect(newFocusSession.stageIteration).to.be.equal(1);
      expect(newFocusSession.lastPingedAt).to.be.deep.equal(new Date('2020-01-01T00:00:30.000Z'));
      expect(newFocusSession.events).to.be.deep.equal([
        {
          type: FocusSessionEventTypeEnum.PAUSED,
          createdAt: '2020-01-01T00:00:30.000Z',
        },
      ]);
    });

    it('should not add additional seconds if it is paused', async () => {
      // First we set those 30 seconds
      vitest.setSystemTime(new Date('2020-01-01T00:00:30.000Z'));
      const newFocusSession = await focusSessionsManager.updateFocusSession(
        initialFocusSession.userId,
        initialFocusSession,
        FocusSessionUpdateActionEnum.PAUSE
      );

      // We pause for 10 seconds and then continue
      vitest.setSystemTime(new Date('2020-01-01T00:00:40.000Z'));
      const newFocusSession2 = await focusSessionsManager.updateFocusSession(
        initialFocusSession.userId,
        newFocusSession,
        FocusSessionUpdateActionEnum.CONTINUE
      );

      // Make sure that only those original 30 seconds were logged
      expect(newFocusSession2.status).to.be.equal(FocusSessionStatusEnum.ACTIVE);
      expect(newFocusSession2.stage).to.be.equal(FocusSessionStageEnum.FOCUS);
      expect(newFocusSession2.stageProgressSeconds).to.be.equal(30);
      expect(newFocusSession2.stageIteration).to.be.equal(1);
      expect(newFocusSession2.lastPingedAt).to.be.deep.equal(new Date('2020-01-01T00:00:40.000Z'));
    });

    it('should not overflow the total time for the stage', async () => {
      // First we set those 90 seconds
      vitest.setSystemTime(new Date('2020-01-01T00:01:30.000Z'));
      const newFocusSession = await focusSessionsManager.updateFocusSession(
        initialFocusSession.userId,
        initialFocusSession,
        FocusSessionUpdateActionEnum.PING
      );

      expect(newFocusSession.status).to.be.equal(FocusSessionStatusEnum.PAUSED);
      expect(newFocusSession.stage).to.be.equal(FocusSessionStageEnum.SHORT_BREAK);
      expect(newFocusSession.stageProgressSeconds).to.be.equal(0);
      expect(newFocusSession.stageIteration).to.be.equal(1);
      expect(newFocusSession.lastPingedAt).to.be.deep.equal(new Date('2020-01-01T00:01:30.000Z'));
    });

    it('should not overflow the total time for the stage', async () => {
      // First we set those 90 seconds
      vitest.setSystemTime(new Date('2020-01-01T00:01:30.000Z'));
      const newFocusSession = await focusSessionsManager.updateFocusSession(
        initialFocusSession.userId,
        initialFocusSession,
        FocusSessionUpdateActionEnum.PING
      );

      expect(newFocusSession.status).to.be.equal(FocusSessionStatusEnum.PAUSED);
      expect(newFocusSession.stage).to.be.equal(FocusSessionStageEnum.SHORT_BREAK);
      expect(newFocusSession.stageProgressSeconds).to.be.equal(0);
      expect(newFocusSession.stageIteration).to.be.equal(1);
      expect(newFocusSession.lastPingedAt).to.be.deep.equal(new Date('2020-01-01T00:01:30.000Z'));
    });

    it('should pause and go to short break stage after it overflows', async () => {
      // First we set those 90 seconds
      vitest.setSystemTime(new Date('2020-01-01T00:01:30.000Z'));
      const newFocusSession = await focusSessionsManager.updateFocusSession(
        initialFocusSession.userId,
        initialFocusSession,
        FocusSessionUpdateActionEnum.PING
      );

      expect(newFocusSession.status).to.be.equal(FocusSessionStatusEnum.PAUSED);
      expect(newFocusSession.stage).to.be.equal(FocusSessionStageEnum.SHORT_BREAK);
      expect(newFocusSession.stageProgressSeconds).to.be.equal(0);
      expect(newFocusSession.stageIteration).to.be.equal(1);
      expect(newFocusSession.lastPingedAt).to.be.deep.equal(new Date('2020-01-01T00:01:30.000Z'));
    });

    it('should pause and go to long break stage after it overflows if we only have one repetition', async () => {
      // First we set those 90 seconds
      vitest.setSystemTime(new Date('2020-01-01T00:01:30.000Z'));
      const newFocusSession = await focusSessionsManager.updateFocusSession(
        initialFocusSession.userId,
        initialFocusSessionOneIteration,
        FocusSessionUpdateActionEnum.PING
      );

      expect(newFocusSession.status).to.be.equal(FocusSessionStatusEnum.PAUSED);
      expect(newFocusSession.stage).to.be.equal(FocusSessionStageEnum.LONG_BREAK);
      expect(newFocusSession.stageProgressSeconds).to.be.equal(0);
      expect(newFocusSession.stageIteration).to.be.equal(1);
      expect(newFocusSession.lastPingedAt).to.be.deep.equal(new Date('2020-01-01T00:01:30.000Z'));
    });

    it('should skip to the correct stages', async () => {
      vitest.setSystemTime(new Date('2020-01-01T00:00:30.000Z'));

      // First skip
      const newFocusSession = await focusSessionsManager.updateFocusSession(
        initialFocusSession.userId,
        initialFocusSession,
        FocusSessionUpdateActionEnum.SKIP
      );

      expect(newFocusSession.status).to.be.equal(FocusSessionStatusEnum.PAUSED);
      expect(newFocusSession.stage).to.be.equal(FocusSessionStageEnum.SHORT_BREAK);
      expect(newFocusSession.stageProgressSeconds).to.be.equal(0);
      expect(newFocusSession.stageIteration).to.be.equal(1);

      // Second skip
      const new2FocusSession = await focusSessionsManager.updateFocusSession(
        initialFocusSession.userId,
        newFocusSession,
        FocusSessionUpdateActionEnum.SKIP
      );

      expect(new2FocusSession.status).to.be.equal(FocusSessionStatusEnum.PAUSED);
      expect(new2FocusSession.stage).to.be.equal(FocusSessionStageEnum.FOCUS);
      expect(new2FocusSession.stageProgressSeconds).to.be.equal(0);
      expect(new2FocusSession.stageIteration).to.be.equal(2);

      // Third skip
      const new3FocusSession = await focusSessionsManager.updateFocusSession(
        initialFocusSession.userId,
        new2FocusSession,
        FocusSessionUpdateActionEnum.SKIP
      );

      expect(new3FocusSession.status).to.be.equal(FocusSessionStatusEnum.PAUSED);
      expect(new3FocusSession.stage).to.be.equal(FocusSessionStageEnum.LONG_BREAK);
      expect(new3FocusSession.stageProgressSeconds).to.be.equal(0);
      expect(new3FocusSession.stageIteration).to.be.equal(2);

      // Fourth skip
      const new4FocusSession = await focusSessionsManager.updateFocusSession(
        initialFocusSession.userId,
        new3FocusSession,
        FocusSessionUpdateActionEnum.SKIP
      );

      expect(new4FocusSession.status).to.be.equal(FocusSessionStatusEnum.PAUSED);
      expect(new4FocusSession.stage).to.be.equal(FocusSessionStageEnum.LONG_BREAK);
      expect(new4FocusSession.stageProgressSeconds).to.be.equal(0);
      expect(new4FocusSession.stageIteration).to.be.equal(2);
      expect(new4FocusSession.completedAt).to.be.deep.equal(new Date('2020-01-01T00:00:30.000Z'));
    });

    it('should skip to the correct stages on single iteration', async () => {
      vitest.setSystemTime(new Date('2020-01-01T00:00:30.000Z'));

      // First skip
      const newFocusSession = await focusSessionsManager.updateFocusSession(
        initialFocusSession.userId,
        initialFocusSessionOneIteration,
        FocusSessionUpdateActionEnum.SKIP
      );

      expect(newFocusSession.status).to.be.equal(FocusSessionStatusEnum.PAUSED);
      expect(newFocusSession.stage).to.be.equal(FocusSessionStageEnum.LONG_BREAK);
      expect(newFocusSession.stageProgressSeconds).to.be.equal(0);
      expect(newFocusSession.stageIteration).to.be.equal(1);

      // Second skip
      const new2FocusSession = await focusSessionsManager.updateFocusSession(
        initialFocusSession.userId,
        newFocusSession,
        FocusSessionUpdateActionEnum.SKIP
      );

      expect(new2FocusSession.status).to.be.equal(FocusSessionStatusEnum.PAUSED);
      expect(new2FocusSession.stage).to.be.equal(FocusSessionStageEnum.LONG_BREAK);
      expect(new2FocusSession.stageProgressSeconds).to.be.equal(0);
      expect(new2FocusSession.stageIteration).to.be.equal(1);
      expect(new2FocusSession.completedAt).to.be.deep.equal(new Date('2020-01-01T00:00:30.000Z'));
    });
  });
});
