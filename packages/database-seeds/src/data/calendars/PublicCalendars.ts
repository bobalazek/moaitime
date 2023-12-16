import { NewCalendar } from '@moaitime/database-core';

export const publicCalendars: NewCalendar[] = [
  {
    name: 'US Holidays',
    timezone: 'America/New_York',
    isPublic: true,
  },
  {
    name: 'UK Holidays',
    timezone: 'Europe/London',
    isPublic: true,
  },
  {
    name: 'Slovenian Holidays',
    timezone: 'Europe/Ljubljana',
    isPublic: true,
  },
  {
    name: 'German Holidays',
    timezone: 'Europe/Berlin',
    isPublic: true,
  },
];
