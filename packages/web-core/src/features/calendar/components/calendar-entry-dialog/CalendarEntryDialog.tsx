import { format } from 'date-fns';
import { useEffect, useState } from 'react';

import {
  convertObjectNullPropertiesToUndefined,
  CreateCalendarEntry,
  UpdateCalendarEntry,
  UpdateCalendarEntrySchema,
  zodErrorToString,
} from '@moaitime/shared-common';
import {
  Button,
  Dialog,
  DialogContent,
  Input,
  Label,
  Switch,
  Textarea,
  useToast,
} from '@moaitime/web-ui';

import { CalendarSelector } from '../../../core/components/selectors/CalendarSelector';
import DateSelector, { DateSelectorData } from '../../../core/components/selectors/DateSelector';
import { useCalendarStore } from '../../state/calendarStore';

const convertIsoToObject = (isoString?: string, showDateTime?: boolean): DateSelectorData => {
  if (!isoString) {
    return {
      date: null,
      dateTime: null,
      dateTimeZone: null,
    };
  }

  const dateObject = new Date(isoString);

  return {
    date: format(dateObject, 'yyyy-MM-dd'),
    dateTime: showDateTime ? format(dateObject, 'HH:mm') : null,
    dateTimeZone: null,
  };
};

const convertObjectToIso = (
  object: DateSelectorData
): { iso: string; timezone: string | undefined } | undefined => {
  if (!object.date) {
    return undefined;
  }

  if (object.dateTime) {
    return { iso: `${object.date}T${object.dateTime}Z`, timezone: undefined };
  }

  return { iso: object.date, timezone: undefined };
};

export default function CalendarEntryDialog() {
  const { toast } = useToast();
  const {
    selectedCalendarEntryDialogOpen,
    selectedCalendarEntry,
    addEvent,
    editEvent,
    setSelectedCalendarEntryDialogOpen,
  } = useCalendarStore();
  const [data, setData] = useState<CreateCalendarEntry | UpdateCalendarEntry>();

  useEffect(() => {
    if (!selectedCalendarEntry) {
      setData(undefined);

      return;
    }

    const parsedSelectedTask = UpdateCalendarEntrySchema.safeParse(
      convertObjectNullPropertiesToUndefined(selectedCalendarEntry)
    );
    if (!parsedSelectedTask.success) {
      toast({
        title: 'Oops!',
        description: zodErrorToString(parsedSelectedTask.error),
      });

      return;
    }

    setData(parsedSelectedTask.data);
  }, [selectedCalendarEntry, toast]);

  const onCancelButtonClick = () => {
    setSelectedCalendarEntryDialogOpen(false);
  };

  const onSaveButtonClick = async () => {
    if (!data) {
      return;
    }

    try {
      const editedEvent = selectedCalendarEntry?.id
        ? await editEvent(selectedCalendarEntry.id.replace('events:', ''), data)
        : await addEvent(data as CreateCalendarEntry);

      toast({
        title: `Event "${editedEvent.title}" save`,
        description: 'You have successfully saved the event',
      });

      setSelectedCalendarEntryDialogOpen(false);
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  return (
    <Dialog
      open={selectedCalendarEntryDialogOpen}
      onOpenChange={setSelectedCalendarEntryDialogOpen}
    >
      <DialogContent data-test="calendarEntry--calendar-entry-dialog">
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="calendarEntry-title">Title</Label>
          <Input
            id="calendarEntry-title"
            value={data?.title ?? ''}
            onChange={(event) => {
              setData((current) => ({ ...current, title: event.target.value }));
            }}
          />
        </div>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="calendarEntry-description">Description</Label>
          <Textarea
            id="calendarEntry-description"
            rows={5}
            value={data?.description ?? ''}
            onChange={(event) => {
              setData((current) => ({ ...current, description: event.target.value }));
            }}
          />
        </div>
        <div className="mb-4 flex items-center space-x-2">
          <Switch
            id="calendarEntry-isAllDay"
            checked={data?.isAllDay}
            onCheckedChange={(value) => {
              setData((current) => ({ ...current, isAllDay: value }));
            }}
          />
          <Label htmlFor="calendarEntry-isAllDay">Is All Day?</Label>
        </div>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="calendarEntry-startsAt">Starts At</Label>
          <DateSelector
            includeTime={!data?.isAllDay}
            data={convertIsoToObject(data?.startsAt, !data?.isAllDay)}
            onSaveData={(saveData) => {
              const result = convertObjectToIso(saveData);

              setData((current) => ({ ...current, startsAt: result?.iso }));
            }}
          />
        </div>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="calendarEntry-endsAt">Ends At</Label>
          <DateSelector
            includeTime={!data?.isAllDay}
            data={convertIsoToObject(data?.endsAt, !data?.isAllDay)}
            onSaveData={(saveData) => {
              const result = convertObjectToIso(saveData);

              setData((current) => ({ ...current, endsAt: result?.iso }));
            }}
          />
        </div>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="calendarEntry-calendar">Calendar</Label>
          <CalendarSelector
            value={data?.calendarId}
            onChangeValue={(value) => {
              setData((current) => ({ ...current, calendarId: value }));
            }}
          />
        </div>
        <div className="flex flex-row justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onCancelButtonClick}>
            Cancel
          </Button>
          <Button type="submit" variant="default" onClick={onSaveButtonClick}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
