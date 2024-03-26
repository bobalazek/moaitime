import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  sonnerToast,
} from '@moaitime/web-ui';

import { useListsStore } from '../../state/listsStore';

export default function ListDeleteAlertDialog() {
  const {
    listDeleteAlertDialogOpen,
    setListDeleteAlertDialogOpen,
    selectedListDeleteAlertDialog,
    deleteList,
  } = useListsStore();
  if (!listDeleteAlertDialogOpen || !selectedListDeleteAlertDialog) {
    return null;
  }

  const onConfirmButtonClick = async () => {
    await deleteList(selectedListDeleteAlertDialog.id, true);

    sonnerToast.success('List deleted', {
      description: `The "${selectedListDeleteAlertDialog.name}" list has been successfully deleted.`,
    });
  };

  return (
    <AlertDialog open={listDeleteAlertDialogOpen} onOpenChange={setListDeleteAlertDialogOpen}>
      <AlertDialogContent data-test="tasks--list-delete-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the "
            <b>{selectedListDeleteAlertDialog.name}</b>" list,{' '}
            <b>including all of the related tasks</b>.
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
