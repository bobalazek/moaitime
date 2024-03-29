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
    it.each([
      // Daily
      {
        testName: 'should return undefined for streak if it is not today',
        now: '2020-02-01T00:00:00.000Z',
        selectedDate: '2020-01-31T00:00:00.000Z',
        habitName: 'Daily Habit',
        habitEntries: [
          { date: '2020-01-30T00:00:00.000Z', amount: 2 },
          { date: '2020-01-31T00:00:00.000Z', amount: 2 },
          { date: '2020-02-01T00:00:00.000Z', amount: 2 },
        ],
        expected: undefined,
      },
      {
        testName: 'should return a streak of 2 for a daily habit if not set today yet',
        now: '2020-02-01T00:00:00.000Z',
        selectedDate: '2020-02-01T00:00:00.000Z',
        habitName: 'Daily Habit',
        habitEntries: [
          { date: '2020-01-30T00:00:00.000Z', amount: 2 },
          { date: '2020-01-31T00:00:00.000Z', amount: 2 },
        ],
        expected: 2,
      },
      {
        testName: 'should return a streak of 3 for a daily habit if set today',
        now: '2020-02-01T00:00:00.000Z',
        selectedDate: '2020-02-01T00:00:00.000Z',
        habitName: 'Daily Habit',
        habitEntries: [
          { date: '2020-01-30T00:00:00.000Z', amount: 2 },
          { date: '2020-01-31T00:00:00.000Z', amount: 2 },
          { date: '2020-02-01T00:00:00.000Z', amount: 2 },
        ],
        expected: 3,
      },
      {
        testName: 'should still return a streak of 3 if there is a broken streak',
        now: '2020-02-01T00:00:00.000Z',
        selectedDate: '2020-02-01T00:00:00.000Z',
        habitName: 'Daily Habit',
        habitEntries: [
          { date: '2020-01-26T00:00:00.000Z', amount: 2 },
          { date: '2020-01-27T00:00:00.000Z', amount: 2 },
          { date: '2020-01-28T00:00:00.000Z', amount: 2 },
          { date: '2020-01-30T00:00:00.000Z', amount: 2 },
          { date: '2020-01-31T00:00:00.000Z', amount: 2 },
          { date: '2020-02-01T00:00:00.000Z', amount: 2 },
        ],
        expected: 3,
      },
      // Weekly
      /*
      {
        testName: 'should return a streak of 2 for a weekly habit if not set today yet',
        now: '2020-06-01T00:00:00.000Z',
        selectedDate: '2020-06-01T00:00:00.000Z',
        habitName: 'Weekly Habit',
        habitEntries: [
          { date: '2020-05-18T00:00:00.000Z', amount: 2 },
          { date: '2020-05-25T00:00:00.000Z', amount: 2 },
        ],
        expected: 2,
      },
      {
        testName: 'should return a streak of 3 for a weekly habit set today',
        now: '2020-06-01T00:00:00.000Z',
        selectedDate: '2020-06-01T00:00:00.000Z',
        habitName: 'Weekly Habit',
        habitEntries: [
          { date: '2020-05-18T00:00:00.000Z', amount: 2 },
          { date: '2020-05-25T00:00:00.000Z', amount: 2 },
          { date: '2020-06-01T00:00:00.000Z', amount: 2 },
        ],
        expected: 3,
      },
      */
    ])(`$testName`, async ({ now, selectedDate, habitName, habitEntries, expected }) => {
      vitest.setSystemTime(new Date(now));

      const habitDaily = await habitsManager.findOneByUserIdAndName(user.id, habitName);
      if (!habitDaily) {
        throw new Error('Habit not found');
      }

      for (const entry of habitEntries) {
        await habitsManager.createHabitEntry(habitDaily.id, new Date(entry.date), entry.amount);
      }

      const habits = await habitsManager.findManyByUserId(user.id);

      const streaksMap = await habitsManager.getDailyHabitStreaksMap(
        habits,
        new Date(selectedDate),
        1 // Monday
      );

      expect(streaksMap.get(habitDaily.id)).toEqual(expected);
    });
  });
});
