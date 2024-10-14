import { UsersIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { CreateCalendar, UpdateCalendar } from '@moaitime/shared-common';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  sonnerToast,
  Switch,
  Textarea,
} from '@moaitime/web-ui';

import { ColorSelector } from '../../../core/components/selectors/ColorSelector';
import { useTeamsStore } from '../../../teams/state/teamsStore';
import { useCalendarStore } from '../../state/calendarStore';

export default function CalendarEditDialog() {
  const {
    selectedCalendarDialogOpen,
    selectedCalendarDialog,
    addCalendar,
    editCalendar,
    deleteCalendar,
    setSelectedCalendarDialogOpen,
  } = useCalendarStore();
  const { joinedTeam } = useTeamsStore();
  const [data, setData] = useState<CreateCalendar | UpdateCalendar>();

  useEffect(() => {
    if (!selectedCalendarDialog) {
      setData(undefined);

      return;
    }

    setData({
      name: selectedCalendarDialog.name,
      description: selectedCalendarDialog.description,
      color: selectedCalendarDialog.color ?? undefined,
      teamId: selectedCalendarDialog.teamId ?? null,
    });
  }, [selectedCalendarDialog]);

  const calendarExists = !!selectedCalendarDialog?.id;

  const onDeleteButtonClick = async () => {
    if (!selectedCalendarDialog) {
      sonnerToast.error('Oops!', {
        description: 'No calendar selected',
      });

      return;
    }

    const result = confirm(
      `Are you sure you want to delete the calendar "${selectedCalendarDialog.name}"?`
    );
    if (!result) {
      return;
    }

    try {
      await deleteCalendar(selectedCalendarDialog.id);

      sonnerToast.success(`Calendar "${selectedCalendarDialog.name}" deleted`, {
        description: 'You have successfully deleted the calendar',
      });

      setSelectedCalendarDialogOpen(false, null);
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  const onCancelButtonClick = () => {
    setSelectedCalendarDialogOpen(false, null);
  };

  const onSaveButtonClick = async () => {
    if (!data) {
      sonnerToast.error('Oops!', {
        description: 'No data to save',
      });

      return;
    }

    try {
      const editedCalendar = selectedCalendarDialog?.id
        ? await editCalendar(selectedCalendarDialog.id, data as UpdateCalendar)
        : await addCalendar(data as CreateCalendar);

      sonnerToast.success(`Calendar "${editedCalendar.name}" save`, {
        description: 'You have successfully saved the calendar',
      });

      setSelectedCalendarDialogOpen(false, null);
      setData(undefined);
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  return (
    <Dialog open={selectedCalendarDialogOpen} onOpenChange={setSelectedCalendarDialogOpen}>
      <DialogContent data-test="calendar--edit-dialog">
        <DialogHeader>
          <DialogTitle className="truncate">
            {calendarExists && <>Edit "{selectedCalendarDialog!.name}" Calendar</>}
            {!calendarExists && <>Create Calendar</>}
          </DialogTitle>
        </DialogHeader>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="calendar-edit-name">Name</Label>
          <Input
            id="calendar-edit-name"
            value={data?.name ?? ''}
            onChange={(event) => {
              setData((current) => ({ ...current, name: event.target.value }));
            }}
          />
        </div>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="calendar-edit-description">Description</Label>
          <Textarea
            id="calendar-edit-description"
            rows={5}
            value={data?.description ?? ''}
            onChange={(event) => {
              setData((current) => ({ ...current, description: event.target.value }));
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="calendar-edit-color">Color</Label>
          <ColorSelector
            value={data?.color ?? undefined}
            onChangeValue={(value) => setData((current) => ({ ...current, color: value }))}
            triggerProps={{
              id: 'calendar-edit-color',
              'data-test': 'calendar--edit-dialog--color-select--trigger-button',
            }}
            contentProps={{
              'data-test': 'tasks--edit-dialog--color-select',
            }}
          />
        </div>
        {calendarExists && selectedCalendarDialog?.teamId && (
          <div className="text-muted-foreground text-xs">
            <UsersIcon className="mr-1 inline-block" size={16} />
            This calendar is shared with your team.
          </div>
        )}
        {joinedTeam && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <Switch
                id="tasks--edit-dialog--teamId"
                checked={(data as CreateCalendar)?.teamId === joinedTeam?.team.id}
                disabled={!joinedTeam}
                onCheckedChange={() => {
                  setData((current) => ({
                    ...current,
                    teamId: (data as CreateCalendar)?.teamId ? null : joinedTeam?.team.id,
                  }));
                }}
              />
              <Label htmlFor="tasks--edit-dialog--teamId" className="ml-2">
                Is Team Calendar?
              </Label>
            </div>
            <p className="text-muted-foreground text-xs">
              With this toggle you will be able to share this calendar with your team.
            </p>
          </div>
        )}
        <div className="flex flex-row justify-between gap-2">
          <div>
            {calendarExists && (
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
      </DialogContent>
    </Dialog>
  );
}
