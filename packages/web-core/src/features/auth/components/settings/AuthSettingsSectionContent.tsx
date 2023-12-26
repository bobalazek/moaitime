import { useEffect, useState } from 'react';

import { Auth } from '@moaitime/shared-common';
import { Button, Input, useToast } from '@moaitime/web-ui';

import { useAuthStore } from '../../state/authStore';

export default function AuthSettingsSectionContent({ auth }: { auth: Auth }) {
  const { toast } = useToast();
  const {
    logout,
    updateAccount,
    resendEmailConfirmation,
    cancelNewEmail,
    setAccountPasswordSettingsDialogOpen,
  } = useAuthStore();
  const [userDisplayName, setUserDisplayName] = useState(auth.user.displayName ?? '');
  const [userEmail, setUserEmail] = useState(auth.user.email ?? '');

  useEffect(() => {
    setUserDisplayName(auth.user.displayName ?? '');
    setUserEmail(auth.user.email ?? '');
  }, [auth.user]);

  const onResendVerificationEmailButtonClick = async () => {
    try {
      await resendEmailConfirmation();

      toast({
        title: `Verification email sent`,
        description: `A verification email has been sent to "${auth.user.email}". Please check your inbox and follow the instructions to verify it.`,
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  const onResendVerificationNewEmailButtonClick = async () => {
    try {
      await resendEmailConfirmation(true);

      toast({
        title: `Verification email sent`,
        description: `A verification email has been sent to "${auth.user.newEmail}". Please check your inbox and follow the instructions to verify it.`,
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  const onCancelNewEmailButtonClick = async () => {
    try {
      await cancelNewEmail();

      toast({
        title: `Email change cancelled`,
        description: `Your email address has been reverted to "${auth.user.email}".`,
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  const onSaveButtonClick = async () => {
    try {
      await updateAccount({
        displayName: userDisplayName,
        email: userEmail,
      });

      toast({
        title: `Accound saved`,
        description: `You have successfully saved your account.`,
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h4 className="text-lg font-bold">Display Name</h4>
        <p className="mb-2 text-xs text-gray-400">What shall we call you?</p>
        <Input
          value={userDisplayName}
          onChange={(event) => {
            setUserDisplayName(event.target.value);
          }}
        />
      </div>
      <div className="mb-4">
        <h4 className="text-lg font-bold">Email</h4>
        <p className="mb-2 text-xs text-gray-400">What is your email?</p>
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
              <button type="button" className="font-bold" onClick={onCancelNewEmailButtonClick}>
                here
              </button>
              .
            </p>
          </div>
        )}
      </div>
      <div className="mb-4">
        <h4 className="text-lg font-bold">Password</h4>
        <p className="mb-2 text-xs text-gray-400">What is your password?</p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setAccountPasswordSettingsDialogOpen(true);
          }}
          data-test="auth--settings--change-password-button"
        >
          Change Password
        </Button>
      </div>
      <div className="mb-4 text-right">
        <Button size="sm" variant="default" onClick={onSaveButtonClick}>
          Save
        </Button>
      </div>
      <hr className="mb-4" />
      <div className="mb-4">
        <h4 className="text-lg font-bold">Logout</h4>
        <p className="mb-2 text-xs text-gray-400">Want to get a breath of fresh air?</p>
        <Button
          size="sm"
          variant="destructive"
          onClick={async () => {
            await logout();
          }}
        >
          Log me out
        </Button>
      </div>
      <hr className="mb-4" />
      <div className="mb-4">
        <h4 className="text-lg font-bold">Delete Account</h4>
        <p className="mb-2 text-xs text-gray-400">
          Ayou you really sure you want to leave us? After pressing the button below, we will send
          you the last email to confirm your choice. Your account will then be premanetely deleted.
        </p>
        <Button
          size="sm"
          variant="destructive"
          onClick={async () => {
            alert('TODO');
          }}
        >
          Delete my account
        </Button>
      </div>
    </div>
  );
}
