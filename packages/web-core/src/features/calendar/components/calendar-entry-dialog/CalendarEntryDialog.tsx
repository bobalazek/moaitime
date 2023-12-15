import { useEffect, useState } from 'react';

import {
  UpdateCalendarEntry,
  UpdateCalendarEntrySchema,
  zodErrorToString,
} from '@moaitime/shared-common';
import { Button, Dialog, DialogContent, Input, Label, Textarea, useToast } from '@moaitime/web-ui';

import { useCalendarStore } from '../../state/calendarStore';

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
      <DialogContent data-test="calendar--calendar-entry-dialog">
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="calendar-title">Title</Label>
          <Input
            id="calendar-title"
            value={data?.title ?? ''}
            onChange={(event) => {
              setData((current) => ({ ...current, title: event.target.value }));
            }}
          />
        </div>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="calendar-description">Description</Label>
          <Textarea
            id="calendar-description"
            rows={5}
            value={data?.description ?? ''}
            onChange={(event) => {
              setData((current) => ({ ...current, description: event.target.value }));
            }}
          />
        </div>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="calendar-startsAt">Starts At</Label>
          <div>TODO</div>
        </div>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="calendar-endsAt">Ends At</Label>
          <div>TODO</div>
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
