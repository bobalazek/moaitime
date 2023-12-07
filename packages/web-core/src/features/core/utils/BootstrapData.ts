import { format } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

import { EventInterface, ListInterface, TASK_LIST_COLORS } from '@myzenbuddy/shared-common';

// TODO: deprecate all this once we have the API set up

export const lists: ListInterface[] = [
  {
    id: 'inbox',
    name: 'Inbox',
    color: TASK_LIST_COLORS[0].value,
  },
  {
    id: 'today',
    name: 'Today',
    color: TASK_LIST_COLORS[1].value,
  },
  {
    id: 'groceries',
    name: 'Groceries',
    color: TASK_LIST_COLORS[2].value,
  },
  {
    id: 'errands',
    name: 'Errands',
    color: TASK_LIST_COLORS[3].value,
  },
];

const now = new Date();
const todaysDate = format(now, 'yyyy-MM-dd');
const timezone = 'Europe/Ljubljana';
const createdAt = now.toISOString();
export const events: EventInterface[] = [
  {
    id: '1',
    title: 'Event 1',
    description: 'Event 1 Description',
    isAllDay: false,
    startsAt: zonedTimeToUtc(`${todaysDate}T12:00:00.000`, timezone).toISOString(),
    endsAt: zonedTimeToUtc(`${todaysDate}T13:00:00.000`, timezone).toISOString(),
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: '2',
    title: 'Event 2',
    description: 'Event 2 Description',
    isAllDay: false,
    startsAt: zonedTimeToUtc(`${todaysDate}T14:00:00.000`, timezone).toISOString(),
    endsAt: zonedTimeToUtc(`${todaysDate}T17:00:00.000`, timezone).toISOString(),
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: '3',
    title: 'Event 3 Overlap',
    description: 'Event 3 Description',
    isAllDay: false,
    startsAt: zonedTimeToUtc(`${todaysDate}T12:00:00.000`, timezone).toISOString(),
    endsAt: zonedTimeToUtc(`${todaysDate}T19:00:00.000`, timezone).toISOString(),
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: '4',
    title: 'Event 4 Overlap',
    description: 'Event 4 Description',
    isAllDay: false,
    startsAt: zonedTimeToUtc(`${todaysDate}T10:00:00.000`, timezone).toISOString(),
    endsAt: zonedTimeToUtc(`${todaysDate}T20:00:00.000`, timezone).toISOString(),
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: '10',
    title: 'Event Full Day',
    description: 'Event Full Day Description',
    isAllDay: true,
    startsAt: zonedTimeToUtc(`${todaysDate}T00:00:00.000`, timezone).toISOString(),
    endsAt: zonedTimeToUtc(`${todaysDate}T23:59:59.999`, timezone).toISOString(),
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: '11',
    title: 'Second Event Full Day',
    description: 'Second Event Full Day Description',
    isAllDay: true,
    startsAt: zonedTimeToUtc(`${todaysDate}T00:00:00.000`, timezone).toISOString(),
    endsAt: zonedTimeToUtc(`${todaysDate}T23:59:59.999`, timezone).toISOString(),
    createdAt,
    updatedAt: createdAt,
  },
];
