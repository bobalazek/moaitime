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
        focusSessionsManager.update(initialFocusSession, FocusSessionUpdateActionEnum.PAUSE);

      await expect(result).rejects.toThrow('Focus session is not active, so it can not be paused');
    });

    it('should not continue if it is already active', async () => {
      const result = () =>
        focusSessionsManager.update(initialFocusSession, FocusSessionUpdateActionEnum.CONTINUE);

      await expect(result).rejects.toThrow(
        'Focus session is not paused, so it can not be continued'
      );
    });

    it('should not allow update if already complete', async () => {
      initialFocusSession = await focusSessionsManager.updateOneById(initialFocusSession.id, {
        completedAt: new Date(),
      });

      const result = () =>
        focusSessionsManager.update(initialFocusSession, FocusSessionUpdateActionEnum.PING);

      await expect(result).rejects.toThrow('Focus session is already completed');
    });

    it('should pause and save the active seconds correctly', async () => {
      vitest.setSystemTime(new Date('2020-01-01T00:00:30.000Z'));

      const newFocusSession = await focusSessionsManager.update(
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
      const newFocusSession = await focusSessionsManager.update(
        initialFocusSession,
        FocusSessionUpdateActionEnum.PAUSE
      );

      // We pause for 10 seconds and then continue
      vitest.setSystemTime(new Date('2020-01-01T00:00:40.000Z'));
      const newFocusSession2 = await focusSessionsManager.update(
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
      const newFocusSession = await focusSessionsManager.update(
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
      const newFocusSession = await focusSessionsManager.update(
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
      const newFocusSession = await focusSessionsManager.update(
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
      const newFocusSession = await focusSessionsManager.update(
        initialFocusSessionOneIteration,
        FocusSessionUpdateActionEnum.PING
      );

      expect(newFocusSession.status).to.be.equal(FocusSessionStatusEnum.PAUSED);
      expect(newFocusSession.stage).to.be.equal(FocusSessionStageEnum.LONG_BREAK);
      expect(newFocusSession.stageProgressSeconds).to.be.equal(0);
      expect(newFocusSession.stageIteration).to.be.equal(1);
      expect(newFocusSession.lastPingedAt).to.be.deep.equal(new Date('2020-01-01T00:01:30.000Z'));
    });
  });
});
