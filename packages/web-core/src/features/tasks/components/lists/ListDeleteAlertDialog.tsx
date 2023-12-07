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
} from '@myzenbuddy/web-ui';

import { useTasksStore } from '../../state/tasksStore';

export default function ListDeleteAlertDialog() {
  const { toast } = useToast();
  const {
    listDeleteAlertDialogOpen,
    setListDeleteAlertDialogOpen,
    selectedListDeleteAlertDialog,
    deleteList,
  } = useTasksStore();
  if (!listDeleteAlertDialogOpen || !selectedListDeleteAlertDialog) {
    return null;
  }

  const onConfirmButtonClick = async () => {
    await deleteList(selectedListDeleteAlertDialog.id);

    toast({
      title: 'List deleted',
      description: `The "${selectedListDeleteAlertDialog.name}" list has been successfully deleted.`,
    });
  };

  return (
    <AlertDialog
      open={listDeleteAlertDialogOpen}
      onOpenChange={setListDeleteAlertDialogOpen}
      data-test="tasks--list-delete-alert-dialog"
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the "
            <b>{selectedListDeleteAlertDialog.name}</b>" list.
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
