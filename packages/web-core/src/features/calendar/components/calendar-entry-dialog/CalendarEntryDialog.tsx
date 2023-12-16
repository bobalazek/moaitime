import { format } from 'date-fns';
import { useEffect, useState } from 'react';

import {
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

import DateSelector, {
  DateSelectorData,
} from '../../../core/components/partials/date-selector/DateSelector';
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
    setSelectedCalendarEntryDialogOpen,
  } = useCalendarStore();
  const [data, setData] = useState<UpdateCalendarEntry>();

  useEffect(() => {
    if (!selectedCalendarEntry) {
      return;
    }

    const parsedSelectedTask = UpdateCalendarEntrySchema.safeParse(selectedCalendarEntry);
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
      return;
    }

    alert('TODO: To be implemented');
  };

  const onCancelButtonClick = () => {
    setSelectedCalendarEntryDialogOpen(false);
  };

  const onSaveButtonClick = async () => {
    if (!selectedCalendarEntry) {
      return;
    }

    alert('TODO: To be implemented');
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