import { useState } from 'react';

import { CreateReport } from '@moaitime/shared-common';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  sonnerToast,
  Textarea,
} from '@moaitime/web-ui';

import { useSocialStore } from '../../state/socialStore';
import { reportUser } from '../../utils/UserHelpers';

export default function UserReportDialog() {
  const { userReportDialogOpen, userReportDialog, setUserReportDialogOpen } = useSocialStore();
  const [data, setData] = useState<CreateReport>({
    content: '',
  });

  const onSaveButtonClick = async () => {
    if (!userReportDialog) {
      sonnerToast.error('Oops!', {
        description: 'User was not selected. Please try again.',
      });
      return;
    }

    try {
      await reportUser(userReportDialog.id, data);

      sonnerToast.success(`Report Submitted`, {
        description: `You have successfully submitted the report for the user.`,
      });

      setUserReportDialogOpen(false, null);
      setData({
        content: '',
      });
    } catch (error) {
      sonnerToast.error('Oops!', {
        description:
          error instanceof Error
            ? error.message
            : 'Something went wrong while submitting the report.',
      });
    }
  };

  return (
    <Dialog open={userReportDialogOpen} onOpenChange={setUserReportDialogOpen}>
      <DialogContent data-test="social--user-report-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center align-middle">
            <span>Report User</span>
          </DialogTitle>
          <DialogDescription>
            Can you please explain why you are reporting this user?
          </DialogDescription>
        </DialogHeader>
        <div>
          <Textarea
            value={data.content}
            onChange={(e) => setData({ ...data, content: e.target.value })}
            placeholder="Please provide a detailed explanation of the issue you are experiencing with this user."
            rows={5}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" variant="default" onClick={onSaveButtonClick}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
