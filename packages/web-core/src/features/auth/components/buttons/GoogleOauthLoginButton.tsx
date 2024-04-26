import { useGoogleLogin } from '@react-oauth/google';

import { OauthProviderEnum } from '@moaitime/shared-common';
import { Button, sonnerToast } from '@moaitime/web-ui';

import { GoogleSvgIcon } from '../../../core/utils/Icons';
import { useAuthStore } from '../../state/authStore';

export default function GoogleOauthLoginButton() {
  const { oauthLogin } = useAuthStore();
  const googleLogin = useGoogleLogin({
    onSuccess: async (token) => {
      try {
        await oauthLogin(OauthProviderEnum.GOOGLE, token);
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

  const onLoginGoogleButtonClick = async () => {
    googleLogin();
  };

  return (
    <Button
      id="login-google-oauth-button"
      size="lg"
      variant="outline"
      tabIndex={4}
      className="flex w-full gap-2"
      onClick={onLoginGoogleButtonClick}
    >
      <GoogleSvgIcon />
      Sign in with Google
    </Button>
  );
}
