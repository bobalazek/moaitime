import { NewEvent } from '@moaitime/database-core';

import albaniaHolidays from './calendars/AlbaniaHolidays';
import animalHolidays from './calendars/AnimalHolidays';
import austrianHolidays from './calendars/AustrianHolidays';
import belgiumHolidays from './calendars/BelgiumHolidays';
import buddhistHolidays from './calendars/BuddhistHolidays';
import christianHolidays from './calendars/ChristianHolidays';
import croatiaHolidays from './calendars/CroatiaHolidays';
import czechRepublicHolidays from './calendars/CzechRepublicHolidays';
import denmarkHolidays from './calendars/DenmarkHolidays';
import finlandHolidays from './calendars/FinlandHolidays';
import frenchHolidays from './calendars/FrenchHolidays';
import germanHolidays from './calendars/GermanHolidays';
import greeceHolidays from './calendars/GreeceHolidays';
import hinduHolidays from './calendars/HinduHolidays';
import icelandHolidays from './calendars/IcelandHolidays';
import irelandHolidays from './calendars/IrelandHolidays';
import islamicHolidays from './calendars/IslamicHolidays';
import italianHolidays from './calendars/ItalianHolidays';
import jewishHolidays from './calendars/JewishHolidays';
import maltaHolidays from './calendars/MaltaHolidays';
import netherlandsHolidays from './calendars/NetherlandsHolidays';
import norwayHolidays from './calendars/NorwayHolidays';
import polandHolidays from './calendars/PolandHolidays';
import romanianHolidays from './calendars/RomanianHolidays';
import scienceHolidays from './calendars/ScienceHolidays';
import sikhHolidays from './calendars/SikhHolidays';
import slovenianHolidays from './calendars/SlovenianHolidays';
import swedenHolidays from './calendars/SwedenHolidays';
import switzerlandHolidays from './calendars/SwitzerlandHolidays';
import ukHolidays from './calendars/UKHolidays';
import ukraineHolidays from './calendars/UkraineHolidays';
import usHolidays from './calendars/USHolidays';

export type PublicCalendarEvent = Omit<NewEvent, 'calendarId' | 'startsAt' | 'endsAt'> & {
  date: string;
  calendarName: string;
};

export const publicCalendarEvents: PublicCalendarEvent[] = [
  ...usHolidays,
  ...ukHolidays,
  ...germanHolidays,
  ...slovenianHolidays,
  ...italianHolidays,
  ...frenchHolidays,
  ...netherlandsHolidays,
  ...switzerlandHolidays,
  ...greeceHolidays,
  ...polandHolidays,
  ...ukraineHolidays,
  ...belgiumHolidays,
  ...austrianHolidays,
  ...norwayHolidays,
  ...swedenHolidays,
  ...irelandHolidays,
  ...romanianHolidays,
  ...denmarkHolidays,
  ...icelandHolidays,
  ...croatiaHolidays,
  ...finlandHolidays,
  ...czechRepublicHolidays,
  ...albaniaHolidays,
  ...maltaHolidays,
  ...scienceHolidays,
  ...animalHolidays,
  ...buddhistHolidays,
  ...christianHolidays,
  ...hinduHolidays,
  ...islamicHolidays,
  ...jewishHolidays,
  ...sikhHolidays,
];
