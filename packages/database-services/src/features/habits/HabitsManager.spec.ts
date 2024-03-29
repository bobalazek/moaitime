/// <reference types="vitest" />

import { User } from '@moaitime/database-core';
import { reloadDatabase } from '@moaitime/database-testing';
import { HabitGoalFrequencyEnum } from '@moaitime/shared-common';

import { usersManager } from '../auth/UsersManager';
import { habitsManager } from './HabitsManager';

const habits = [
  {
    name: 'Daily Habit',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
  },
  {
    name: 'Weekly Habit',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.WEEK,
  },
  {
    name: 'Monthly Habit',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.MONTH,
  },
  {
    name: 'Yearly Habit',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.YEAR,
  },
];

describe('HabitsManager.ts', () => {
  let user: User;

  beforeEach(async () => {
    await reloadDatabase();

    user = await usersManager.insertOne({
      displayName: 'test',
      username: 'focussessiontest',
      email: 'focussessiontest@test.com',
      password: 'test',
    });

    for (const habit of habits) {
      await habitsManager.insertOne({
        ...habit,
        userId: user.id,
      });
    }
  });

  describe('getDailyHabitStreaksMap()', () => {
    it('should return undefined for streak if it is not today', async () => {
      vitest.setSystemTime(new Date('2020-01-31T00:00:00.000Z'));

      const habitDaily = await habitsManager.findOneByUserIdAndName(user.id, 'Daily Habit');
      if (!habitDaily) {
        throw new Error('Habit not found');
      }

      await habitsManager.createHabitEntry(habitDaily.id, new Date('2020-01-31T00:00:00.000Z'), 1);
      await habitsManager.createHabitEntry(habitDaily.id, new Date('2020-02-01T00:00:00.000Z'), 1);

      const habits = await habitsManager.findManyByUserId(user.id);

      const streaksMap = await habitsManager.getDailyHabitStreaksMap(
        habits,
        new Date('2020-02-01T00:00:00.000Z'),
        1 // Monday
      );

      expect(streaksMap.get(habitDaily.id)).toEqual(undefined);
    });

    it('should work with daily habits', async () => {
      vitest.setSystemTime(new Date('2020-02-01T00:00:00.000Z'));

      const habitDaily = await habitsManager.findOneByUserIdAndName(user.id, 'Daily Habit');
      if (!habitDaily) {
        throw new Error('Habit not found');
      }

      await habitsManager.createHabitEntry(habitDaily.id, new Date('2020-01-31T00:00:00.000Z'), 1);
      await habitsManager.createHabitEntry(habitDaily.id, new Date('2020-02-01T00:00:00.000Z'), 1);

      const habits = await habitsManager.findManyByUserId(user.id);

      const streaksMap = await habitsManager.getDailyHabitStreaksMap(
        habits,
        new Date('2020-02-01T00:00:00.000Z'),
        1 // Monday
      );

      expect(streaksMap.get(habitDaily.id)).toEqual(2);
    });
  });
});
