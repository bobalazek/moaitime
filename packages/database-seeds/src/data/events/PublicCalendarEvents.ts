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
  {
    title: "New Year's Day",
    date: '2021-01-01',
    calendarName: 'US Holidays',
  },
  {
    title: 'Martin Luther King Jr. Day',
    date: '2022-01-17',
    calendarName: 'US Holidays',
  },
  {
    title: "Washington's Birthday",
    date: '2022-02-15',
    calendarName: 'US Holidays',
  },
  {
    title: 'Memorial Day',
    date: '2022-05-30',
    calendarName: 'US Holidays',
  },
  {
    title: 'Juneteenth',
    date: '2022-06-19',
    calendarName: 'US Holidays',
  },
  {
    title: 'Independence Day',
    date: '2022-07-04',
    calendarName: 'US Holidays',
  },
  {
    title: 'Labor Day',
    date: '2022-09-05',
    calendarName: 'US Holidays',
  },
  {
    title: 'Veterans Day',
    date: '2022-11-11',
    calendarName: 'US Holidays',
  },
  {
    title: 'Thanksgiving Day',
    date: '2022-11-24',
    calendarName: 'US Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2022-12-26',
    calendarName: 'US Holidays',
  },
  {
    title: "New Year's Day",
    date: '2023-01-02',
    calendarName: 'US Holidays',
  },
  {
    title: 'Martin Luther King Jr. Day',
    date: '2023-01-16',
    calendarName: 'US Holidays',
  },
  {
    title: "Washington's Birthday",
    date: '2023-02-20',
    calendarName: 'US Holidays',
  },
  {
    title: 'Memorial Day',
    date: '2023-05-29',
    calendarName: 'US Holidays',
  },
  {
    title: 'Juneteenth',
    date: '2023-06-19',
    calendarName: 'US Holidays',
  },
  {
    title: 'Independence Day',
    date: '2023-07-04',
    calendarName: 'US Holidays',
  },
  {
    title: 'Labor Day',
    date: '2023-09-04',
    calendarName: 'US Holidays',
  },
  {
    title: 'Veterans Day',
    date: '2023-11-10',
    calendarName: 'US Holidays',
  },
  {
    title: 'Thanksgiving Day',
    date: '2023-11-23',
    calendarName: 'US Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2023-12-23',
    calendarName: 'US Holidays',
  },
  {
    title: "New Year's Day",
    date: '2024-01-01',
    calendarName: 'US Holidays',
  },
  {
    title: 'Martin Luther King Jr. Day',
    date: '2024-01-15',
    calendarName: 'US Holidays',
  },
  {
    title: "Washington's Birthday",
    date: '2024-02-19',
    calendarName: 'US Holidays',
  },
  {
    title: 'Memorial Day',
    date: '2024-05-27',
    calendarName: 'US Holidays',
  },
  {
    title: 'Juneteenth',
    date: '2024-06-19',
    calendarName: 'US Holidays',
  },
  {
    title: 'Independence Day',
    date: '2024-07-04',
    calendarName: 'US Holidays',
  },
  {
    title: 'Labor Day',
    date: '2024-09-02',
    calendarName: 'US Holidays',
  },
  {
    title: 'Veterans Day',
    date: '2024-11-11',
    calendarName: 'US Holidays',
  },
  {
    title: 'Thanksgiving Day',
    date: '2024-11-28',
    calendarName: 'US Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2024-12-25',
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
  {
    title: "New Year's Day",
    date: '2022-01-03',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Good Friday',
    date: '2022-04-15',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2022-04-18',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Early May bank holiday',
    date: '2022-05-02',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Spring bank holiday',
    date: '2022-06-02',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Platinum Jubilee bank holiday',
    date: '2022-06-03',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Summer bank holiday',
    date: '2022-08-29',
    calendarName: 'UK Holidays',
  },
  {
    title: 'State Funeral of Queen Elizabeth II',
    date: '2022-09-19',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Boxing Day',
    date: '2022-12-26',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2022-12-27',
    calendarName: 'UK Holidays',
  },
  {
    title: "New Year's Day",
    date: '2023-01-02',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Good Friday',
    date: '2023-04-07',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2023-04-10',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Early May bank holiday',
    date: '2023-05-01',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Bank holiday for the coronation of King Charles III',
    date: '2023-05-08',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Spring bank holiday',
    date: '2023-05-29',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Summer bank holiday',
    date: '2023-08-28',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2023-12-25',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Boxing Day',
    date: '2023-12-26',
    calendarName: 'UK Holidays',
  },
  {
    title: "New Year's Day",
    date: '2024-01-01',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Good Friday',
    date: '2024-03-29',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2024-04-01',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Early May bank holiday',
    date: '2024-05-06',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Spring bank holiday',
    date: '2024-05-27',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Summer bank holiday',
    date: '2024-08-26',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2024-12-25',
    calendarName: 'UK Holidays',
  },
  {
    title: 'Boxing Day',
    date: '2024-12-26',
    calendarName: 'UK Holidays',
  },
  // German Holidays
  {
    title: "New Year's Day",
    date: '2021-01-01',
    calendarName: 'German Holidays',
  },
  {
    title: 'Epiphany',
    date: '2021-01-06',
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
  {
    title: "New Year's Day",
    date: '2022-01-01',
    calendarName: 'German Holidays',
  },
  {
    title: 'Epiphany',
    date: '2022-01-06',
    calendarName: 'German Holidays',
  },
  {
    title: 'Good Friday',
    date: '2022-04-15',
    calendarName: 'German Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2022-04-15',
    calendarName: 'German Holidays',
  },
  {
    title: 'Labour Day',
    date: '2022-05-01',
    calendarName: 'German Holidays',
  },
  {
    title: 'Ascension Day',
    date: '2022-05-26',
    calendarName: 'German Holidays',
  },
  {
    title: 'Whit Monday',
    date: '2022-06-06',
    calendarName: 'German Holidays',
  },
  {
    title: 'Corpus Christi',
    date: '2022-06-16',
    calendarName: 'German Holidays',
  },
  {
    title: 'Assumption Day',
    date: '2022-08-15',
    calendarName: 'German Holidays',
  },
  {
    title: 'World Childrens Day',
    date: '2022-09-20',
    calendarName: 'German Holidays',
  },
  {
    title: 'Day of German Unity',
    date: '2022-10-03',
    calendarName: 'German Holidays',
  },
  {
    title: 'Reformation Day',
    date: '2022-10-31',
    calendarName: 'German Holidays',
  },
  {
    title: "All Saints' Day",
    date: '2022-11-01',
    calendarName: 'German Holidays',
  },
  {
    title: 'Repentance and Prayer Day',
    date: '2022-11-16',
    calendarName: 'German Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2022-12-25',
    calendarName: 'German Holidays',
  },
  {
    title: 'Second Day of Christmas',
    date: '2022-12-26',
    calendarName: 'German Holidays',
  },
  {
    title: "New Year's Day",
    date: '2023-01-01',
    calendarName: 'German Holidays',
  },
  {
    title: 'Epiphany',
    date: '2023-01-06',
    calendarName: 'German Holidays',
  },
  {
    title: 'Good Friday',
    date: '2023-04-07',
    calendarName: 'German Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2023-04-10',
    calendarName: 'German Holidays',
  },
  {
    title: 'Labour Day',
    date: '2023-05-01',
    calendarName: 'German Holidays',
  },
  {
    title: 'Ascension Day',
    date: '2023-05-18',
    calendarName: 'German Holidays',
  },
  {
    title: 'Whit Monday',
    date: '2023-06-29',
    calendarName: 'German Holidays',
  },
  {
    title: 'Corpus Christi',
    date: '2023-06-08',
    calendarName: 'German Holidays',
  },
  {
    title: 'Assumption Day',
    date: '2023-08-15',
    calendarName: 'German Holidays',
  },
  {
    title: 'World Childrens Day',
    date: '2023-09-20',
    calendarName: 'German Holidays',
  },
  {
    title: 'Day of German Unity',
    date: '2023-10-03',
    calendarName: 'German Holidays',
  },
  {
    title: 'Reformation Day',
    date: '2023-10-31',
    calendarName: 'German Holidays',
  },
  {
    title: "All Saints' Day",
    date: '2023-11-01',
    calendarName: 'German Holidays',
  },
  {
    title: 'Repentance and Prayer Day',
    date: '2023-11-22',
    calendarName: 'German Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2023-12-25',
    calendarName: 'German Holidays',
  },
  {
    title: 'Second Day of Christmas',
    date: '2023-12-26',
    calendarName: 'German Holidays',
  },
  {
    title: "New Year's Day",
    date: '2024-01-01',
    calendarName: 'German Holidays',
  },
  {
    title: 'Epiphany',
    date: '2024-01-06',
    calendarName: 'German Holidays',
  },
  {
    title: 'Good Friday',
    date: '2024-03-29',
    calendarName: 'German Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2024-03-31',
    calendarName: 'German Holidays',
  },
  {
    title: 'Labour Day',
    date: '2024-05-01',
    calendarName: 'German Holidays',
  },
  {
    title: 'Ascension Day',
    date: '2024-05-09',
    calendarName: 'German Holidays',
  },
  {
    title: 'Whit Monday',
    date: '2024-05-20',
    calendarName: 'German Holidays',
  },
  {
    title: 'Corpus Christi',
    date: '2024-05-30',
    calendarName: 'German Holidays',
  },
  {
    title: 'Assumption Day',
    date: '2024-08-15',
    calendarName: 'German Holidays',
  },
  {
    title: 'World Childrens Day',
    date: '2024-09-20',
    calendarName: 'German Holidays',
  },
  {
    title: 'Day of German Unity',
    date: '2024-10-03',
    calendarName: 'German Holidays',
  },
  {
    title: 'Reformation Day',
    date: '2024-10-31',
    calendarName: 'German Holidays',
  },
  {
    title: "All Saints' Day",
    date: '2024-11-01',
    calendarName: 'German Holidays',
  },
  {
    title: 'Repentance and Prayer Day',
    date: '2024-11-20',
    calendarName: 'German Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2024-12-25',
    calendarName: 'German Holidays',
  },
  {
    title: 'Second Day of Christmas',
    date: '2024-12-26',
    calendarName: 'German Holidays',
  },
  // Slovenian Holidays
  {
    title: "New Year's Day",
    date: '2021-01-01',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: "New Year's Day",
    date: '2021-01-02',
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
    title: 'Reformation Day',
    date: '2021-10-31',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Day of Remembrance for the Dead',
    date: '2021-11-01',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2021-12-25',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Independence Day and Unity Day',
    date: '2021-12-26',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: "New Year's Day",
    date: '2022-01-01',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: "New Year's Day",
    date: '2022-01-02',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Prešeren Day, Cultural Holiday',
    date: '2022-02-08',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Easter Sunday',
    date: '2022-04-17',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2022-04-18',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Day of Uprising Against Occupation',
    date: '2022-04-27',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Labour Day',
    date: '2022-05-01',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Statehood Day',
    date: '2022-06-25',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Assumption of Mary',
    date: '2022-08-15',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Reformation Day',
    date: '2022-10-31',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Day of Remembrance for the Dead',
    date: '2022-11-01',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2022-12-25',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Independence Day and Unity Day',
    date: '2022-12-26',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: "New Year's Day",
    date: '2023-01-01',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: "New Year's Day",
    date: '2023-01-02',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Prešeren Day, Cultural Holiday',
    date: '2023-02-08',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Easter Sunday',
    date: '2023-04-09',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2023-04-10',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Day of Uprising Against Occupation',
    date: '2023-04-27',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Labour Day',
    date: '2023-05-01',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Statehood Day',
    date: '2023-06-25',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Assumption of Mary',
    date: '2023-08-15',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Reformation Day',
    date: '2023-10-31',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Day of Remembrance for the Dead',
    date: '2023-11-01',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2023-12-25',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Independence Day and Unity Day',
    date: '2023-12-26',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: "New Year's Day",
    date: '2024-01-01',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: "New Year's Day",
    date: '2024-01-02',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Prešeren Day, Cultural Holiday',
    date: '2024-02-08',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Easter Sunday',
    date: '2024-03-31',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2024-04-01',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Day of Uprising Against Occupation',
    date: '2024-04-27',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Labour Day',
    date: '2024-05-01',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Statehood Day',
    date: '2024-06-25',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Assumption of Mary',
    date: '2024-08-15',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Reformation Day',
    date: '2024-10-31',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Day of Remembrance for the Dead',
    date: '2024-11-01',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2024-12-25',
    calendarName: 'Slovenian Holidays',
  },
  {
    title: 'Independence Day and Unity Day',
    date: '2024-12-26',
    calendarName: 'Slovenian Holidays',
  },
  // Italian Holidays
  {
    title: "New Year's Day",
    date: '2023-01-01',
    calendarName: 'Italian Holidays',
  },
  {
    title: 'Epiphany ',
    date: '2023-01-06',
    calendarName: 'Italian Holidays',
  },
  {
    title: 'Easter Sunday',
    date: '2023-04-09',
    calendarName: 'Italian Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2023-04-10',
    calendarName: 'Italian Holidays',
  },
  {
    title: 'Liberation Day',
    date: '2023-04-25',
    calendarName: 'Italian Holidays',
  },
  {
    title: 'Labour Day',
    date: '2023-05-01',
    calendarName: 'Italian Holidays',
  },
  {
    title: 'Republic Day',
    date: '2023-06-02',
    calendarName: 'Italian Holidays',
  },
  {
    title: 'Assumption ',
    date: '2023-08-15',
    calendarName: 'Italian Holidays',
  },
  {
    title: "All Saints' Day",
    date: '2023-11-01',
    calendarName: 'Italian Holidays',
  },
  {
    title: 'Immaculate Conception Day',
    date: '2023-12-08',
    calendarName: 'Italian Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2023-12-25',
    calendarName: 'Italian Holidays',
  },
  {
    title: "St Stephen's Day",
    date: '2023-12-26',
    calendarName: 'Italian Holidays',
  },
  {
    title: "New Year's Day",
    date: '2024-01-01',
    calendarName: 'Italian Holidays',
  },
  {
    title: 'Epiphany ',
    date: '2024-01-06',
    calendarName: 'Italian Holidays',
  },
  {
    title: 'Easter Sunday',
    date: '2024-03-31',
    calendarName: 'Italian Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2024-04-01',
    calendarName: 'Italian Holidays',
  },
  {
    title: 'Liberation Day',
    date: '2024-04-25',
    calendarName: 'Italian Holidays',
  },
  {
    title: 'Labour Day',
    date: '2024-05-01',
    calendarName: 'Italian Holidays',
  },
  {
    title: 'Republic Day',
    date: '2024-06-02',
    calendarName: 'Italian Holidays',
  },
  {
    title: 'Assumption ',
    date: '2024-08-15',
    calendarName: 'Italian Holidays',
  },
  {
    title: "All Saints' Day",
    date: '2024-11-01',
    calendarName: 'Italian Holidays',
  },
  {
    title: 'Immaculate Conception Day',
    date: '2024-12-08',
    calendarName: 'Italian Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2024-12-25',
    calendarName: 'Italian Holidays',
  },
  {
    title: "St Stephen's Day",
    date: '2024-12-26',
    calendarName: 'Italian Holidays',
  },
  // French Holidays
  {
    title: "New Year's Day",
    date: '2023-01-01',
    calendarName: 'French Holidays',
  },
  {
    title: 'Good Friday',
    date: '2023-04-07',
    calendarName: 'French Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2023-04-10',
    calendarName: 'French Holidays',
  },
  {
    title: 'Labour Day',
    date: '2023-05-01',
    calendarName: 'French Holidays',
  },
  {
    title: 'Victory Day',
    date: '2023-05-08',
    calendarName: 'French Holidays',
  },
  {
    title: 'Ascension Day',
    date: '2023-05-18',
    calendarName: 'French Holidays',
  },
  {
    title: 'Whit Sunday',
    date: '2023-05-28',
    calendarName: 'French Holidays',
  },
  {
    title: 'Whit Monday',
    date: '2023-05-29',
    calendarName: 'French Holidays',
  },
  {
    title: 'Bastille Day',
    date: '2023-07-14',
    calendarName: 'French Holidays',
  },
  {
    title: 'Assumption Day',
    date: '2023-08-15',
    calendarName: 'French Holidays',
  },
  {
    title: "All Saints' Day",
    date: '2023-11-01',
    calendarName: 'French Holidays',
  },
  {
    title: 'Armistice Day',
    date: '2023-11-11',
    calendarName: 'French Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2023-12-25',
    calendarName: 'French Holidays',
  },
  {
    title: "St Stephenq's Day",
    date: '2023-12-26',
    calendarName: 'French Holidays',
  },
  {
    title: "New Year's Day",
    date: '2024-01-01',
    calendarName: 'French Holidays',
  },
  {
    title: 'Good Friday',
    date: '2024-03-29',
    calendarName: 'French Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2024-04-01',
    calendarName: 'French Holidays',
  },
  {
    title: 'Labour Day',
    date: '2024-05-01',
    calendarName: 'French Holidays',
  },
  {
    title: 'Victory Day',
    date: '2024-05-08',
    calendarName: 'French Holidays',
  },
  {
    title: 'Ascension Day',
    date: '2024-05-09',
    calendarName: 'French Holidays',
  },
  {
    title: 'Whit Sunday',
    date: '2024-05-19',
    calendarName: 'French Holidays',
  },
  {
    title: 'Whit Monday',
    date: '2024-05-20',
    calendarName: 'French Holidays',
  },
  {
    title: 'Bastille Day',
    date: '2024-07-14',
    calendarName: 'French Holidays',
  },
  {
    title: 'Assumption Day',
    date: '2024-08-15',
    calendarName: 'French Holidays',
  },
  {
    title: "All Saints' Day",
    date: '2024-11-01',
    calendarName: 'French Holidays',
  },
  {
    title: 'Armistice Day',
    date: '2024-11-11',
    calendarName: 'French Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2024-12-25',
    calendarName: 'French Holidays',
  },
  {
    title: "St Stephenq's Day",
    date: '2024-12-26',
    calendarName: 'French Holidays',
  },
  // Netherlands Holidays
  {
    title: "New Year's Day",
    date: '2023-01-01',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: 'Good Friday',
    date: '2023-04-07',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: 'Easter Sunday',
    date: '2023-04-09',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2023-04-10',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: "King's Day",
    date: '2023-04-27',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: 'Liberation Day',
    date: '2023-05-05',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: 'Ascension Day',
    date: '2023-05-18',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: 'Whit Sunday',
    date: '2023-05-28',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: 'Whit Monday',
    date: '2023-05-29',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2023-12-25',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: '2nd Day of Christmas',
    date: '2023-12-26',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: "New Year's Day",
    date: '2024-01-01',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: 'Good Friday',
    date: '2024-03-29',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: 'Easter Sunday',
    date: '2023-03-31',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2023-04-01',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: "King's Day",
    date: '2023-04-27',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: 'Liberation Day',
    date: '2023-05-05',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: 'Ascension Day',
    date: '2023-05-09',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: 'Whit Sunday',
    date: '2023-05-19',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: 'Whit Monday',
    date: '2023-05-20',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2023-12-25',
    calendarName: 'Netherlands Holidays',
  },
  {
    title: '2nd Day of Christmas',
    date: '2023-12-26',
    calendarName: 'Netherlands Holidays',
  },
  // Switzerland Holidays
  {
    title: "New Year's Day",
    date: '2023-01-01',
    calendarName: 'Switzerland Holidays',
  },
  {
    title: 'Good Friday',
    date: '2023-04-07',
    calendarName: 'Switzerland Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2023-04-10',
    calendarName: 'Switzerland Holidays',
  },
  {
    title: 'Ascension Day',
    date: '2023-05-18',
    calendarName: 'Switzerland Holidays',
  },
  {
    title: 'Whit Monday',
    date: '2023-05-29',
    calendarName: 'Switzerland Holidays',
  },
  {
    title: 'Corpus Christi',
    date: '2023-06-08',
    calendarName: 'Switzerland Holidays',
  },
  {
    title: 'National Day',
    date: '2023-08-01',
    calendarName: 'Switzerland Holidays',
  },
  {
    title: "All Saints' Day",
    date: '2023-11-01',
    calendarName: 'Switzerland Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2023-12-25',
    calendarName: 'Switzerland Holidays',
  },
  {
    title: "St Stephen's Day",
    date: '2023-12-26',
    calendarName: 'Switzerland Holidays',
  },
  {
    title: "New Year's Day",
    date: '2024-01-01',
    calendarName: 'Switzerland Holidays',
  },
  {
    title: 'Good Friday',
    date: '2023-03-29',
    calendarName: 'Switzerland Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2023-04-01',
    calendarName: 'Switzerland Holidays',
  },
  {
    title: 'Ascension Day',
    date: '2024-05-09',
    calendarName: 'Switzerland Holidays',
  },
  {
    title: 'Whit Monday',
    date: '2023-05-20',
    calendarName: 'Switzerland Holidays',
  },
  {
    title: 'Corpus Christi',
    date: '2023-05-30',
    calendarName: 'Switzerland Holidays',
  },
  {
    title: 'National Day',
    date: '2024-08-01',
    calendarName: 'Switzerland Holidays',
  },
  {
    title: "All Saints' Day",
    date: '2024-11-01',
    calendarName: 'Switzerland Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2024-12-25',
    calendarName: 'Switzerland Holidays',
  },
  {
    title: "St Stephen's Day",
    date: '2024-12-26',
    calendarName: 'Switzerland Holidays',
  },
  // Greece Holidays
  {
    title: "New Year's Day",
    date: '2023-01-01',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Epiphany',
    date: '2023-01-06',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Orthodox Ash Monday',
    date: '2023-02-27',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Independence Day',
    date: '2023-03-25',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Orthodox Good Friday',
    date: '2023-04-14',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Orthodox Easter Sunday',
    date: '2023-04-16',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Orthodox Easter Monday',
    date: '2023-04-17',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Labour Day',
    date: '2023-05-01',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Orthodox Whit Sunday',
    date: '2023-06-04',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Orthodox Whit Monday',
    date: '2023-06-05',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Assumption Day',
    date: '2023-08-15',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Ochi Day',
    date: '2023-10-28',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2023-12-25',
    calendarName: 'Greece Holidays',
  },
  {
    title: '2nd Day of Christmas',
    date: '2023-12-26',
    calendarName: 'Greece Holidays',
  },
  {
    title: "New Year's Day",
    date: '2024-01-01',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Epiphany',
    date: '2024-01-06',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Orthodox Ash Monday',
    date: '2024-03-18',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Independence Day',
    date: '2024-03-25',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Labour Day',
    date: '2024-05-01',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Orthodox Good Friday',
    date: '2024-05-03',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Orthodox Easter Sunday',
    date: '2024-05-05',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Orthodox Easter Monday',
    date: '2024-05-06',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Orthodox Whit Sunday',
    date: '2024-06-23',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Orthodox Whit Monday',
    date: '2024-06-24',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Assumption Day',
    date: '2024-08-15',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Ochi Day',
    date: '2024-10-28',
    calendarName: 'Greece Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2024-12-25',
    calendarName: 'Greece Holidays',
  },
  {
    title: '2nd Day of Christmas',
    date: '2024-12-26',
    calendarName: 'Greece Holidays',
  },
  // Poland Holidays
  {
    title: "New Year's Day",
    date: '2023-01-01',
    calendarName: 'Poland Holidays',
  },
  {
    title: 'Epiphany',
    date: '2023-01-06',
    calendarName: 'Poland Holidays',
  },
  {
    title: 'Easter Sunday',
    date: '2023-04-09',
    calendarName: 'Poland Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2023-04-10',
    calendarName: 'Poland Holidays',
  },
  {
    title: 'Labour Day',
    date: '2023-05-01',
    calendarName: 'Poland Holidays',
  },
  {
    title: 'Constitution Day',
    date: '2023-05-03',
    calendarName: 'Poland Holidays',
  },
  {
    title: 'Whit Sunday',
    date: '2023-05-28',
    calendarName: 'Poland Holidays',
  },
  {
    title: 'Corpus Christi',
    date: '2023-06-08',
    calendarName: 'Poland Holidays',
  },
  {
    title: 'Assumption Day',
    date: '2023-08-15',
    calendarName: 'Poland Holidays',
  },
  {
    title: "All Saints' Day",
    date: '2023-11-01',
    calendarName: 'Poland Holidays',
  },
  {
    title: 'Independence Day',
    date: '2023-11-11',
    calendarName: 'Poland Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2023-12-25',
    calendarName: 'Poland Holidays',
  },
  {
    title: '2nd Day of Christmas',
    date: '2023-12-26',
    calendarName: 'Poland Holidays',
  },
  {
    title: "New Year's Day",
    date: '2024-01-01',
    calendarName: 'Poland Holidays',
  },
  {
    title: 'Epiphany',
    date: '2024-01-06',
    calendarName: 'Poland Holidays',
  },
  {
    title: 'Easter Sunday',
    date: '2024-03-31',
    calendarName: 'Poland Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2024-04-01',
    calendarName: 'Poland Holidays',
  },
  {
    title: 'Labour Day',
    date: '2024-05-01',
    calendarName: 'Poland Holidays',
  },
  {
    title: 'Constitution Day',
    date: '2024-05-03',
    calendarName: 'Poland Holidays',
  },
  {
    title: 'Whit Sunday',
    date: '2024-05-19',
    calendarName: 'Poland Holidays',
  },
  {
    title: 'Corpus Christi',
    date: '2024-05-30',
    calendarName: 'Poland Holidays',
  },
  {
    title: 'Assumption Day',
    date: '2024-08-15',
    calendarName: 'Poland Holidays',
  },
  {
    title: "All Saints' Day",
    date: '2024-11-01',
    calendarName: 'Poland Holidays',
  },
  {
    title: 'Independence Day',
    date: '2024-11-11',
    calendarName: 'Poland Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2024-12-25',
    calendarName: 'Poland Holidays',
  },
  {
    title: '2nd Day of Christmas',
    date: '2024-12-26',
    calendarName: 'Poland Holidays',
  },
  // Ukraine Holidays
  {
    title: "New Year's Day",
    date: '2023-01-01',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: "New Year's Day",
    date: '2023-01-02',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Orthodox Christmas Day',
    date: '2023-01-07',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Orthodox Christmas Holiday',
    date: '2023-01-09',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: "Women's Day",
    date: '2023-03-08',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Orthodox Easter Sunday',
    date: '2023-04-16',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Orthodox Easter Monday',
    date: '2023-04-17',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Labor Day',
    date: '2023-05-01',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Victory Day over Nazism in World War II',
    date: '2023-05-09',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Orthodox Whit Sunday',
    date: '2023-06-04',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Orthodox Whit Monday',
    date: '2023-06-05',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Constitution Day',
    date: '2023-06-28',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Ukrainian Statehood Day',
    date: '2023-07-28',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Independence Day',
    date: '2023-08-24',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: "Defender's Day",
    date: '2023-10-14',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: "Defender's Day Holiday",
    date: '2023-10-16',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Catholic Christmas Day',
    date: '2023-12-25',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: "New Year's Day",
    date: '2023-01-01',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Orthodox Christmas Day',
    date: '2024-01-07',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Orthodox Christmas Holiday',
    date: '2024-01-08',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: "Women's Day",
    date: '2024-03-08',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Labor Day',
    date: '2024-05-01',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Orthodox Easter Sunday',
    date: '2024-05-05',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Orthodox Easter Monday',
    date: '2024-05-06',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Victory Day over Nazism in World War II',
    date: '2024-05-09',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Orthodox Whit Sunday',
    date: '2024-06-23',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Orthodox Whit Monday',
    date: '2024-06-24',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Constitution Day',
    date: '2024-06-28',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Ukrainian Statehood Day',
    date: '2024-07-28',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Independence Day',
    date: '2024-08-24',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Independence Day Holiday',
    date: '2024-08-26',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: "Defender's Day",
    date: '2024-10-14',
    calendarName: 'Ukraine Holidays',
  },
  {
    title: 'Catholic Christmas Day',
    date: '2024-12-25',
    calendarName: 'Ukraine Holidays',
  },
  // Belgium Holidays
  {
    title: "New Year's Day",
    date: '2023-01-01',
    calendarName: 'Belgium Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2023-04-10',
    calendarName: 'Belgium Holidays',
  },
  {
    title: 'Labour Day',
    date: '2023-05-01',
    calendarName: 'Belgium Holidays',
  },
  {
    title: 'Ascension Day',
    date: '2023-05-18',
    calendarName: 'Belgium Holidays',
  },
  {
    title: 'Whit Monday',
    date: '2023-05-29',
    calendarName: 'Belgium Holidays',
  },
  {
    title: 'National Day',
    date: '2023-07-21',
    calendarName: 'Belgium Holidays',
  },
  {
    title: 'Assumption Day',
    date: '2023-08-15',
    calendarName: 'Belgium Holidays',
  },
  {
    title: "All Saints' Day",
    date: '2023-11-01',
    calendarName: 'Belgium Holidays',
  },
  {
    title: 'Armistice Day',
    date: '2023-11-11',
    calendarName: 'Belgium Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2023-12-25',
    calendarName: 'Belgium Holidays',
  },
  {
    title: "New Year's Day",
    date: '2024-01-01',
    calendarName: 'Belgium Holidays',
  },
  {
    title: 'Easter Monday',
    date: '2024-04-01',
    calendarName: 'Belgium Holidays',
  },
  {
    title: 'Labour Day',
    date: '2024-05-01',
    calendarName: 'Belgium Holidays',
  },
  {
    title: 'Ascension Day',
    date: '2024-05-09',
    calendarName: 'Belgium Holidays',
  },
  {
    title: 'Whit Monday',
    date: '2024-05-20',
    calendarName: 'Belgium Holidays',
  },
  {
    title: 'National Day',
    date: '2024-07-21',
    calendarName: 'Belgium Holidays',
  },
  {
    title: 'Assumption Day',
    date: '2024-08-15',
    calendarName: 'Belgium Holidays',
  },
  {
    title: "All Saints' Day",
    date: '2024-11-01',
    calendarName: 'Belgium Holidays',
  },
  {
    title: 'Armistice Day',
    date: '2024-11-11',
    calendarName: 'Belgium Holidays',
  },
  {
    title: 'Christmas Day',
    date: '2024-12-25',
    calendarName: 'Belgium Holidays',
  },
];
