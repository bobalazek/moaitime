import { useEffect, useState } from 'react';

import {
  convertObjectNullPropertiesToUndefined,
  CreateCalendar,
  UpdateCalendar,
  UpdateCalendarSchema,
  zodErrorToString,
} from '@moaitime/shared-common';
import { Button, Dialog, DialogContent, Input, Label, Textarea, useToast } from '@moaitime/web-ui';

import { useCalendarStore } from '../../state/calendarStore';

export default function CalendarDialog() {
  const { toast } = useToast();
  const {
    selectedCalendarDialogOpen,
    selectedCalendar,
    addCalendar,
    editCalendar,
    deleteCalendar,
    setSelectedCalendarDialogOpen,
  } = useCalendarStore();
  const [data, setData] = useState<CreateCalendar | UpdateCalendar>();

  useEffect(() => {
    if (!selectedCalendar) {
      setData(undefined);

      return;
    }

    const parsedSelectedTask = UpdateCalendarSchema.safeParse(
      convertObjectNullPropertiesToUndefined(selectedCalendar)
    );
    if (!parsedSelectedTask.success) {
      toast({
        title: 'Oops!',
        description: zodErrorToString(parsedSelectedTask.error),
      });

      return;
    }

    setData(parsedSelectedTask.data);
  }, [selectedCalendar, toast]);

  const calendarExists = !!selectedCalendar?.id;

  const onDeleteButtonClick = async () => {
    if (!selectedCalendar) {
      toast({
        title: 'Oops!',
        description: 'No calendar selected',
      });

      return;
    }

    try {
      await deleteCalendar(selectedCalendar.id);

      toast({
        title: `Calendar "${selectedCalendar.name}" deleted`,
        description: 'You have successfully deleted the calendar',
      });

      setSelectedCalendarDialogOpen(false, null);
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  const onCancelButtonClick = () => {
    setSelectedCalendarDialogOpen(false, null);
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
      const editedCalendar = calendarExists
        ? await editCalendar(selectedCalendar.id, data as UpdateCalendar)
        : await addCalendar(data as CreateCalendar);

      toast({
        title: `Calendar "${editedCalendar.name}" save`,
        description: 'You have successfully saved the calendar',
      });

      setSelectedCalendarDialogOpen(false, null);
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  return (
    <Dialog open={selectedCalendarDialogOpen} onOpenChange={setSelectedCalendarDialogOpen}>
      <DialogContent data-test="calendar--dialog">
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="calendar-name">Name</Label>
          <Input
            id="calendar-name"
            value={data?.name ?? ''}
            onChange={(event) => {
              setData((current) => ({ ...current, name: event.target.value }));
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
