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
];
