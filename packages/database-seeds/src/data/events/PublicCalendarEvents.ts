import { NewEvent } from '@moaitime/database-core';

export const publicCalendarEvents: (Omit<NewEvent, 'calendarId' | 'startsAt' | 'endsAt'> & {
  date: string;
  calendarName: string;
})[] = [
  // US Holidays
  {
    title: "New Year's Day",
    date: '2021-01-01',
    calendarName: 'US Holidays',
  },
  {
    title: 'Martin Luther King Jr. Day',
    date: '2021-01-18',
    calendarName: 'US Holidays',
  },
  {
    title: "Washington's Birthday",
    date: '2021-02-15',
    calendarName: 'US Holidays',
  },
  {
    title: 'Memorial Day',
    date: '2021-05-31',
    calendarName: 'US Holidays',
  },
  {
    title: 'Independence Day',
    date: '2021-07-05',
    calendarName: 'US Holidays',
  },
  {
    title: 'Labor Day',
    date: '2021-09-06',
    calendarName: 'US Holidays',
  },
  {
    title: 'Columbus Day',
    date: '2021-10-11',
    calendarName: 'US Holidays',
  },
  {
    title: 'Veterans Day',
    date: '2021-11-11',
    calendarName: 'US Holidays',
  },
  {
    title: 'Thanksgiving Day',
    date: '2021-11-25',
    calendarName: 'US Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2021-12-24',
    calendarName: 'US Holidays',
  },
  // UK Holidays
  {
    title: "New Year's Day",
    date: '2021-01-01',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Good Friday',
    date: '2021-04-02',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2021-04-05',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Early May bank holiday',
    date: '2021-05-03',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Spring bank holiday',
    date: '2021-05-31',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Summer bank holiday',
    date: '2021-08-30',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2021-12-25',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Boxing Day',
    date: '2021-12-26',
    calendarName: 'UK Holidays',
  },
  // German Holidays
  {
    title: "New Year's Day",
    date: '2021-01-01',
    calendarName: 'German Holidays',
  },
  {
    title: 'Good Friday',
    date: '2021-04-02',
    calendarName: 'German Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2021-04-05',
    calendarName: 'German Holidays',
  },
  {
    title: 'Labour Day',
    date: '2021-05-01',
    calendarName: 'German Holidays',
  },
  {
    title: 'Ascension Day',
    date: '2021-05-13',
    calendarName: 'German Holidays',
  },
  {
    title: 'Whit Monday',
    date: '2021-05-24',
    calendarName: 'German Holidays',
  },
  {
    title: 'Corpus Christi',
    date: '2021-06-03',
    calendarName: 'German Holidays',
  },
  {
    title: 'Assumption Day',
    date: '2021-08-15',
    calendarName: 'German Holidays',
  },
  {
    title: 'World Childrens Day',
    date: '2021-09-20',
    calendarName: 'German Holidays',
  },
  {
    title: 'Day of German Unity',
    date: '2021-10-03',
    calendarName: 'German Holidays',
  },
  {
    title: 'Reformation Day',
    date: '2021-10-31',
    calendarName: 'German Holidays',
  },
  {
    title: "All Saints' Day",
    date: '2021-11-01',
    calendarName: 'German Holidays',
  },
  {
    title: 'Repentance and Prayer Day',
    date: '2021-11-17',
    calendarName: 'German Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2021-12-25',
    calendarName: 'German Holidays',
  },
  {
    title: 'Second Day of Christmas',
    date: '2021-12-26',
    calendarName: 'German Holidays',
  },
  // Slovenian Holidays
  {
    title: "New Year's Day",
    date: '2021-01-01',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Prešeren Day, Cultural Holiday',
    date: '2021-02-08',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Easter Sunday',
    date: '2021-04-04',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2021-04-05',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Day of Uprising Against Occupation',
    date: '2021-04-27',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Labour Day',
    date: '2021-05-01',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Statehood Day',
    date: '2021-06-25',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Assumption of Mary',
    date: '2021-08-15',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Day of Slovenian Independence',
    date: '2021-10-25',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Reformation Day',
    date: '2021-10-31',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Remembrance Day',
    date: '2021-11-01',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2021-12-25',
    calendarName: 'Slovenian Holidays',
  },
];
