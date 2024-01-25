import { useEffect, useState } from 'react';

import { UpdateUserCalendar } from '@moaitime/shared-common';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Label,
  sonnerToast,
} from '@moaitime/web-ui';

import { ColorSelector } from '../../../core/components/selectors/ColorSelector';
import { useCalendarStore } from '../../state/calendarStore';

export default function UserCalendarEditDialog() {
  const {
    selectedUserCalendarDialogOpen,
    selectedUserCalendar,
    updateUserCalendar,
    setSelectedUserCalendarDialogOpen,
  } = useCalendarStore();
  const [data, setData] = useState<UpdateUserCalendar>();

  useEffect(() => {
    setData(
      selectedUserCalendar
        ? {
            color: selectedUserCalendar.color,
          }
        : undefined
    );
  }, [selectedUserCalendar]);

  const onCancelButtonClick = () => {
    setSelectedUserCalendarDialogOpen(false, null);
  };

  const onSaveButtonClick = async () => {
    if (!selectedUserCalendar || !data) {
      sonnerToast.error('Oops!', {
        description: 'No data to save',
      });

      return;
    }

    try {
      await updateUserCalendar(selectedUserCalendar.id, data);

      sonnerToast.success(`Shared calendar save`, {
        description: 'You have successfully saved the shared calendar',
      });

      setSelectedUserCalendarDialogOpen(false, null);
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  return (
    <Dialog open={selectedUserCalendarDialogOpen} onOpenChange={setSelectedUserCalendarDialogOpen}>
      <DialogContent data-test="user-calendar--edit-dialog">
        <DialogHeader>
          <DialogTitle>{selectedUserCalendar?.calendar?.name ?? 'Shared Calendar'}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="user-calendar-edit-color">Color</Label>
          <ColorSelector
            value={data?.color ?? undefined}
            onChangeValue={(value) => setData((current) => ({ ...current, color: value }))}
            triggerProps={{
              id: 'user-calendar-edit-color',
              'data-test': 'user-calendar--edit-dialog--color-select--trigger-button',
            }}
            contentProps={{
              'data-test': 'tasks--edit-dialog--color-select',
            }}
          />
        </div>
        <div className="flex flex-row justify-between gap-2">
          <div></div>
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
