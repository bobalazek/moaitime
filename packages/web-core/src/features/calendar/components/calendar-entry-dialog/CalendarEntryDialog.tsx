import { useEffect, useState } from 'react';

import {
  convertObjectNullPropertiesToUndefined,
  CreateCalendarEntry,
  CreateEvent,
  UpdateCalendarEntry,
  UpdateCalendarEntrySchema,
  UpdateEvent,
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
import { convertIsoStringToObject, convertObjectToIsoString } from '../../utils/CalendarHelpers';

export default function CalendarEntryDialog() {
  const { toast } = useToast();
  const {
    selectedCalendarEntryDialogOpen,
    selectedCalendarEntry,
    addEvent,
    editEvent,
    deleteEvent,
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

  const onDeleteButtonClick = async () => {
    if (!selectedCalendarEntry) {
      toast({
        title: 'Oops!',
        description: 'No calendar entry selected',
      });

      return;
    }

    try {
      await deleteEvent(selectedCalendarEntry.id.replace('events:', ''));

      toast({
        title: `Event "${selectedCalendarEntry.title}" deleted`,
        description: 'You have successfully deleted the event',
      });

      setSelectedCalendarEntryDialogOpen(false, null);
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  const onCancelButtonClick = () => {
    setSelectedCalendarEntryDialogOpen(false, null);
  };

  const onSaveButtonClick = async () => {
    if (!data) {
      toast({
        title: 'Oops!',
        description: 'No data to save',
      });

      return;
    }

    try {
      const editedEvent = selectedCalendarEntry?.id
        ? await editEvent(selectedCalendarEntry.id.replace('events:', ''), data as UpdateEvent)
        : await addEvent(data as CreateEvent);

      toast({
        title: `Event "${editedEvent.title}" save`,
        description: 'You have successfully saved the event',
      });

      setSelectedCalendarEntryDialogOpen(false, null);
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
            data={convertIsoStringToObject(
              data?.startsAt,
              !data?.isAllDay,
              // TODO: we should probably use the timezone of the calendar
              data?.timezone ?? undefined
            )}
            onSaveData={(saveData) => {
              const result = convertObjectToIsoString<DateSelectorData>(saveData);

              setData((current) => ({ ...current, startsAt: result?.iso }));
            }}
            isTimezoneReadonly={!!selectedCalendarEntry?.id}
            timezonePlaceholderText="Select timezone ..."
          />
        </div>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="calendarEntry-endsAt">Ends At</Label>
          <DateSelector
            includeTime={!data?.isAllDay}
            data={convertIsoStringToObject(
              data?.endsAt,
              !data?.isAllDay,
              data?.endTimezone ?? undefined
            )}
            onSaveData={(saveData) => {
              const result = convertObjectToIsoString<DateSelectorData>(saveData);

              setData((current) => ({ ...current, endsAt: result?.iso }));
            }}
            isTimezoneReadonly={!!selectedCalendarEntry?.id}
            timezonePlaceholderText="Same as start date"
          />
        </div>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="calendarEntry-calendar">Calendar</Label>
          <CalendarSelector
            value={data?.calendarId}
            onChangeValue={(value) => {
              setData((current) => ({
                ...current,
                calendarId: value,
              }));
            }}
          />
        </div>
        <div className="flex flex-row justify-between gap-2">
          <div>
            <Button type="button" variant="destructive" onClick={onDeleteButtonClick}>
              Delete
            </Button>
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
      </DialogContent>
    </Dialog>
  );
}
