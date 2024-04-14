import { addMinutes, format } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { useEffect, useState } from 'react';

import { addDateTimezoneToItself, CreateEvent, UpdateEvent } from '@moaitime/shared-common';
import { Button, Input, Label, sonnerToast, Switch, Textarea } from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../../auth/state/authStore';
import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { CalendarSelector } from '../../../core/components/selectors/CalendarSelector';
import { ColorSelector } from '../../../core/components/selectors/ColorSelector';
import DateSelector, { DateSelectorData } from '../../../core/components/selectors/DateSelector';
import { RepeatSelector } from '../../../core/components/selectors/RepeatSelector';
import { useEventsStore } from '../../state/eventsStore';
import { convertIsoStringToObject, convertObjectToIsoString } from '../../utils/CalendarHelpers';

export default function EventEditDialogBody() {
  const {
    selectedEvent,
    addEvent,
    editEvent,
    deleteEvent,
    undeleteEvent,
    setSelectedEventDialogOpen,
  } = useEventsStore();
  const [data, setData] = useState<CreateEvent | UpdateEvent>();

  useEffect(() => {
    if (!selectedEvent) {
      setData(undefined);

      return;
    }

    setData(selectedEvent as CreateEvent);
  }, [selectedEvent]);

  const generalTimezone = useAuthUserSetting('generalTimezone', 'UTC');

  const eventExists = !!selectedEvent?.id;

  const dataTimezone = data && 'timezone' in data ? data.timezone : undefined;
  const dataEndTimezone = data && 'endTimezone' in data ? data.endTimezone : undefined;
  const dataIsAllDay = data && 'isAllDay' in data ? data.isAllDay ?? false : false;
  const dataRepeatPattern = data && 'repeatPattern' in data ? data.repeatPattern : undefined;
  const dataCalendarId = data && 'calendarId' in data ? data.calendarId : undefined;

  const startDateInCurrentTimezone =
    !dataIsAllDay && data?.startsAt && dataTimezone !== generalTimezone
      ? format(
          utcToZonedTime(zonedTimeToUtc(data.startsAt, dataTimezone ?? 'UTC'), generalTimezone),
          'PPP p'
        )
      : null;
  const endDateInCurrentTimezone =
    !dataIsAllDay && data?.endsAt && dataEndTimezone && dataEndTimezone !== generalTimezone
      ? format(
          utcToZonedTime(zonedTimeToUtc(data.endsAt, dataEndTimezone ?? 'UTC'), generalTimezone),
          'PPP p'
        )
      : null;

  const onDeleteButtonClick = async () => {
    if (!selectedEvent) {
      sonnerToast.error('Oops!', {
        description: 'No calendar entry selected',
      });

      return;
    }

    try {
      const eventId = selectedEvent.id;

      await deleteEvent(eventId);

      sonnerToast.success(`Event "${selectedEvent.title}" deleted`, {
        description: 'You have successfully deleted the event',
        action: {
          label: 'Undo',
          onClick: () => undeleteEvent(eventId),
        },
      });

      setSelectedEventDialogOpen(false, null);
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  const onCancelButtonClick = () => {
    setSelectedEventDialogOpen(false, null);
  };

  const onSaveButtonClick = async () => {
    if (!data) {
      sonnerToast.error('Oops!', {
        description: 'No data to save',
      });

      return;
    }

    try {
      const editedEvent = selectedEvent?.id
        ? await editEvent(selectedEvent.id, data as UpdateEvent)
        : await addEvent(data as CreateEvent);

      sonnerToast.success(`Event "${editedEvent.title}" save`, {
        description: 'You have successfully saved the event',
      });

      setSelectedEventDialogOpen(false, null);
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  return (
    <div className="flex w-full flex-col flex-wrap gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="event-title">Title</Label>
        <Input
          id="event-title"
          value={data?.title ?? ''}
          onChange={(event) => {
            setData((current) => ({ ...current, title: event.target.value }) as CreateEvent);
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="event-description">Description</Label>
        <Textarea
          id="event-description"
          rows={5}
          value={data?.description ?? ''}
          onChange={(event) => {
            setData((current) => ({ ...current, description: event.target.value }) as CreateEvent);
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="event-isAllDay"
          checked={dataIsAllDay}
          onCheckedChange={(value) => {
            setData((current) => ({ ...current, isAllDay: value }) as CreateEvent);
          }}
          disabled={eventExists}
        />
        <Label htmlFor="event-isAllDay">Is All Day?</Label>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="event-startsAt">Starts At</Label>
        <DateSelector
          includeTime={!dataIsAllDay}
          disableClear
          data={convertIsoStringToObject(
            data?.startsAt,
            !dataIsAllDay,
            !dataIsAllDay ? dataTimezone ?? undefined : undefined
          )}
          onSaveData={(saveData) => {
            const result = convertObjectToIsoString<DateSelectorData>(saveData);
            const startsAt = result?.iso ? result.iso : undefined;

            let endsAt = data?.endsAt; // we also want to update so it's always in the future
            if (startsAt && endsAt && new Date(startsAt) >= new Date(endsAt)) {
              endsAt = addDateTimezoneToItself(
                addMinutes(new Date(startsAt), !dataIsAllDay ? 30 : 0)
              )
                .toISOString()
                .slice(0, -1);
            }

            setData(
              (current) =>
                ({
                  ...current,
                  startsAt,
                  timezone: saveData.dateTimeZone,
                  endsAt,
                }) as CreateEvent
            );
          }}
          isTimezoneReadonly={eventExists}
          timezonePlaceholderText="Select timezone ..."
        />
        {startDateInCurrentTimezone && (
          <div className="text-muted-foreground text-xs">
            Translates to{' '}
            <b>
              {startDateInCurrentTimezone}, {generalTimezone}
            </b>{' '}
            timezone
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="event-endsAt">Ends At</Label>
        <DateSelector
          includeTime={!dataIsAllDay}
          disableClear
          data={convertIsoStringToObject(
            data?.endsAt,
            !dataIsAllDay,
            !dataIsAllDay ? dataEndTimezone ?? undefined : undefined
          )}
          onSaveData={(saveData) => {
            const result = convertObjectToIsoString<DateSelectorData>(saveData);

            setData(
              (current) =>
                ({
                  ...current,
                  endsAt: result?.iso,
                  endTimezone: saveData.dateTimeZone,
                }) as CreateEvent
            );
          }}
          isTimezoneReadonly={eventExists}
          timezonePlaceholderText={eventExists ? selectedEvent.timezone! : 'Same as start date'}
        />
        {endDateInCurrentTimezone && (
          <div className="text-muted-foreground text-xs">
            Translates to{' '}
            <b>
              {endDateInCurrentTimezone}, {generalTimezone}
            </b>{' '}
            timezone
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="event-repeat">Repeat</Label>
        <ErrorBoundary>
          <RepeatSelector
            value={dataRepeatPattern ?? undefined}
            startsAt={new Date(data?.startsAt ?? Date.now())}
            onChangeValue={(value, endsAt) => {
              setData(
                (current) =>
                  ({
                    ...current,
                    repeatPattern: value ?? null,
                    repeatEndsAt: endsAt ?? null,
                  }) as CreateEvent
              );
            }}
            disableTime={dataIsAllDay}
          />
        </ErrorBoundary>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="event-calendar">Calendar</Label>
        <CalendarSelector
          value={dataCalendarId}
          onChangeValue={(value) => {
            setData(
              (current) =>
                ({
                  ...current,
                  calendarId: value,
                }) as CreateEvent
            );
          }}
          isReadonly={eventExists}
          autoSelectFirstIfValueNoneSet
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="event-color">Color</Label>
        <ColorSelector
          value={data?.color ?? undefined}
          onChangeValue={(value) =>
            setData((current) => ({ ...current, color: value ?? null }) as CreateEvent)
          }
          placeholderText="Inherit from calendar"
        />
      </div>
      <div className="flex flex-row justify-between gap-2">
        <div>
          {eventExists && (
            <Button type="button" variant="destructive" onClick={onDeleteButtonClick}>
              Delete
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onCancelButtonClick}>
            Cancel
          </Button>
          <Button type="submit" variant="default" onClick={onSaveButtonClick}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
