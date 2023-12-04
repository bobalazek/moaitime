import { useState } from 'react';

import { AuthInterface } from '@myzenbuddy/shared-common';
import { Button, Input, useToast } from '@myzenbuddy/web-ui';

import { useAuthStore } from '../../state/authStore';

export default function AuthSettingsSectionContent({ auth }: { auth: AuthInterface }) {
  const { toast } = useToast();
  const {
    logout,
    updateSettings,
    resendEmailConfirmation,
    resendNewEmailConfirmation,
    cancelNewEmailConfirmation,
  } = useAuthStore();
  const [userDisplayName, setUserDisplayName] = useState(auth.user.displayName || '');
  const [userEmail, setUserEmail] = useState(auth.user.email || '');

  const onResendVerificationEmailButtonClick = async () => {
    await resendEmailConfirmation();

    toast({
      title: `Verification email sent`,
      description: `A verification email has been sent to "${auth.user.email}". Please check your inbox and follow the instructions to verify it.`,
    });
  };

  const onResendVerificationNewEmailButtonClick = async () => {
    await resendNewEmailConfirmation();

    toast({
      title: `Verification email sent`,
      description: `A verification email has been sent to "${auth.user.newEmail}". Please check your inbox and follow the instructions to verify it.`,
    });
  };

  const onCancelNewEmailConfirmationButtonClick = async () => {
    await cancelNewEmailConfirmation();

    toast({
      title: `Email change cancelled`,
      description: `Your email address has been reverted to "${auth.user.email}".`,
    });
  };

  const onSaveButtonClick = async () => {
    try {
      await updateSettings({
        displayName: userDisplayName,
        email: userEmail,
      });

      toast({
        title: `Accound saved`,
        description: `You have successfully saved your account.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description:
          error instanceof Error
            ? error.message
            : 'Something went wrong while trying to save the account',
      });
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h4 className="mb-2 text-lg font-bold">Display Name</h4>
        <Input
          value={userDisplayName}
          onChange={(event) => {
            setUserDisplayName(event.target.value);
          }}
        />
      </div>
      <div className="mb-4">
        <h4 className="mb-2 text-lg font-bold">Email</h4>
        <Input
          value={userEmail}
          onChange={(event) => {
            setUserEmail(event.target.value);
          }}
        />
        {!auth.user.emailConfirmedAt && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Your email address has not been verified yet. Please check your inbox and follow the
              instructions to verify it. Click{' '}
              <button
                type="button"
                className="font-bold"
                onClick={onResendVerificationEmailButtonClick}
              >
                here
              </button>{' '}
              to resend the verification email.
            </p>
          </div>
        )}
        {auth.user.newEmail && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              A verification email has been sent to <b>{auth.user.newEmail}</b>. Please check the
              inbox of that email address and follow the instructions to verify it. In case you did
              not get it, click{' '}
              <button
                type="button"
                className="font-bold"
                onClick={onResendVerificationNewEmailButtonClick}
              >
                here
              </button>{' '}
              to resend the verification email. If you want to cancel the email change, click{' '}
              <button
                type="button"
                className="font-bold"
                onClick={onCancelNewEmailConfirmationButtonClick}
              >
                here
              </button>
              .
            </p>
          </div>
        )}
      </div>
      <div className="mb-4">
        <h4 className="mb-2 text-lg font-bold">Password</h4>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            alert('TODO: implement this');
          }}
        >
          Set Password
        </Button>
      </div>
      <div className="mb-4 text-right">
        <Button size="sm" variant="default" onClick={onSaveButtonClick}>
          Save
        </Button>
      </div>
      <hr className="mb-4" />
      <div className="mb-4">
        <h4 className="mb-2 text-lg font-bold">Logout</h4>
        <Button
          size="sm"
          variant="destructive"
          onClick={async () => {
            await logout();
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
