import { useGoogleLogin } from '@react-oauth/google';

import { OauthToken } from '@moaitime/shared-common';
import { Button, sonnerToast } from '@moaitime/web-ui';

import { GoogleSvgIcon } from '../../../core/utils/Icons';

export type GoogleOauthRegisterButtonProps = {
  onSuccess: (token: OauthToken) => Promise<void>;
};

export default function GoogleOauthRegisterButton({ onSuccess }: GoogleOauthRegisterButtonProps) {
  const googleConnect = useGoogleLogin({
    onSuccess: async (token) => {
      try {
        await onSuccess(token);
      } catch (error) {
        // Already handled by the fetch function
      }
    },
    onError: (error) => {
      sonnerToast.error('Google login failed', {
        description: error.error_description,
      });
    },
  });

  const onGoogleConnectButtonClick = async () => {
    googleConnect();
  };

  return (
    <Button
      id="register-google-oauth-button"
      size="lg"
      variant="outline"
      tabIndex={3}
      className="flex w-full gap-2"
      onClick={onGoogleConnectButtonClick}
    >
      <GoogleSvgIcon />
      Connect with Google
    </Button>
  );
}
