import { addMilliseconds, subMinutes } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

import { addDateTimezoneToItself } from '../Helpers';
import { Task } from './TaskSchema';

export const getDueDateStringForTask = (task: Task, timezone: string) => {
  if (!task.dueDate) {
    return null;
  }

  let dateString = task.dueDate;
  if (task.dueDateTime) {
    dateString = `${dateString}T${task.dueDateTime}:00.000`;
  } else {
    dateString = dateString + 'T23:59:59.999';
  }

  if (task.dueDateTimeZone) {
    const timezonedDate = utcToZonedTime(
      zonedTimeToUtc(dateString, task.dueDateTimeZone),
      timezone
    );

    dateString = timezonedDate.toISOString();
  }

  return dateString;
};

export const getStartAndEndDatesForTask = (
  task: Task,
  generalTimezone: string,
  tasksDefaultDurationSeconds: number
) => {
  if (!task.dueDate) {
    return null;
  }

  const timezone = task.dueDateTimeZone ?? generalTimezone;

  let isAllDay = false;
  let dateString = task.dueDate!;
  if (task.dueDateTime) {
    dateString = `${dateString}T${task.dueDateTime}:00.000`;
  } else {
    dateString = dateString + 'T23:59:59.999';
    isAllDay = true;
  }

  if (task.dueDateTimeZone) {
    const timezonedDate = utcToZonedTime(
      zonedTimeToUtc(dateString, task.dueDateTimeZone),
      timezone
    );

    dateString = timezonedDate.toISOString().slice(0, -1);
  }

  const endsAt = dateString;
  const endsAtDate = zonedTimeToUtc(endsAt, timezone);
  const endsAtUtc = endsAtDate.toISOString();

  const startDurationMinutesSub = task.durationSeconds
    ? task.durationSeconds / 60
    : tasksDefaultDurationSeconds / 60;

  const startsAtDate = addDateTimezoneToItself(subMinutes(endsAtDate, startDurationMinutesSub));
  const startsAt = (isAllDay ? addMilliseconds(startsAtDate, 1) : startsAtDate)
    .toISOString()
    .slice(0, -1);
  const startsAtUtc = zonedTimeToUtc(startsAt, timezone).toISOString();

  return {
    timezone,
    startsAt,
    startsAtUtc,
    endTimezone: timezone,
    endsAt,
    endsAtUtc,
    isAllDay,
  };
};
