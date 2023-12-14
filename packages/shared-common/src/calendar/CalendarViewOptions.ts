export enum CalendarViewEnum {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  AGENDA = 'agenda',
}

export const calendarViewOptions = [
  {
    label: 'Day',
    value: CalendarViewEnum.DAY,
    keyboardShortcutKey: 'd',
  },
  {
    label: 'Week',
    value: CalendarViewEnum.WEEK,
    keyboardShortcutKey: 'w',
    // Not optimal because that value may get stripped,
    // BUT we do use the "hidden" and "lg:flex" classes in the codebase,
    // so should be fine.
    // In case you do decide to switch those classes,
    // make sure that those classes are actually used somewhere in the codebase,
    // so PostCSS knows not to strip them out!
    className: 'hidden lg:flex',
  },
  {
    label: 'Month',
    value: CalendarViewEnum.MONTH,
    keyboardShortcutKey: 'm',
  },
  {
    label: 'Year',
    value: CalendarViewEnum.YEAR,
    keyboardShortcutKey: 'y',
  },
  {
    label: 'Agenda',
    value: CalendarViewEnum.AGENDA,
    keyboardShortcutKey: 'a',
  },
];
