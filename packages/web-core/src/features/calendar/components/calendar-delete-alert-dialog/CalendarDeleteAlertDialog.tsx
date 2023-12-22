import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  useToast,
} from '@moaitime/web-ui';

import { useCalendarStore } from '../../state/calendarStore';

export default function CalendarDeleteAlertDialog() {
  const { toast } = useToast();
  const {
    calendarDeleteAlertDialogOpen,
    setCalendarDeleteAlertDialogOpen,
    selectedCalendarDeleteAlertDialog,
    deleteCalendar,
  } = useCalendarStore();
  if (!calendarDeleteAlertDialogOpen || !selectedCalendarDeleteAlertDialog) {
    return null;
  }

  const onConfirmButtonClick = async () => {
    await deleteCalendar(selectedCalendarDeleteAlertDialog.id, true);

    toast({
      title: 'Calendar deleted',
      description: `The "${selectedCalendarDeleteAlertDialog.name}" calendar has been successfully deleted.`,
    });
  };

  return (
    <AlertDialog
      open={calendarDeleteAlertDialogOpen}
      onOpenChange={setCalendarDeleteAlertDialogOpen}
    >
      <AlertDialogContent data-test="calendar--calendar-delete-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the "
            <b>{selectedCalendarDeleteAlertDialog.name}</b>" calendar,{' '}
            <b>including all of the related events</b>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmButtonClick}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
