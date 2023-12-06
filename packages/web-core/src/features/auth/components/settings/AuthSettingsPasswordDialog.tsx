import { useEffect, useState } from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  useToast,
} from '@myzenbuddy/web-ui';

import { useAuthStore } from '../../state/authStore';

export default function AuthSettingsPasswordDialog() {
  const { toast } = useToast();
  const { passwordSettingsDialogOpen, setPasswordSettingsDialogOpen, updatePasswordSettings } =
    useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    setCurrentPassword('');
    setNewPassword('');
  }, [passwordSettingsDialogOpen]);

  const onSaveButtonClick = async () => {
    try {
      await updatePasswordSettings({
        currentPassword,
        newPassword,
      });

      toast({
        title: 'Password updated',
        description: 'You have successfully updated your password',
      });

      setPasswordSettingsDialogOpen(false);
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  const onCancelButtonClick = () => {
    setPasswordSettingsDialogOpen(false);
  };

  return (
    <Dialog
      open={passwordSettingsDialogOpen}
      onOpenChange={setPasswordSettingsDialogOpen}
      data-test="auth--settings--password-dialog"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <div className="my-4 flex flex-col gap-2">
          <Label htmlFor="passwordSettings-currentPassword">Current Password</Label>
          <Input
            type="password"
            id="passwordSettings-currentPassword"
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value);
            }}
          />
        </div>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="passwordSettings-newPassword">New Password</Label>
          <Input
            type="password"
            id="passwordSettings-newPassword"
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value);
            }}
          />
        </div>
        <DialogFooter>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onCancelButtonClick}>
              Cancel
            </Button>
            <Button type="submit" variant="default" onClick={onSaveButtonClick}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
