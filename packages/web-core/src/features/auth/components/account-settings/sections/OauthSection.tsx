import { useGoogleLogin } from '@react-oauth/google';

import { OauthProviderEnum } from '@moaitime/shared-common';
import { Button, sonnerToast } from '@moaitime/web-ui';

import { useAuthStore } from '../../../state/authStore';

export const OauthSection = () => {
  const { auth, oauthLink, oauthUnlink } = useAuthStore();
  const googleOauthLink = useGoogleLogin({
    onSuccess: async (token) => {
      try {
        await oauthLink(OauthProviderEnum.GOOGLE, token);

        sonnerToast.success('Google account linked', {
          description: 'Your Google account has been successfully linked to your account.',
        });
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

  const onOauthGoogleLinkButtonClick = async () => {
    googleOauthLink();
  };

  const onOauthGoogleUnlinkButtonClick = async () => {
    try {
      await oauthUnlink(OauthProviderEnum.GOOGLE);

      sonnerToast.success('Google account unlinked', {
        description: 'Your Google account has been successfully unlinked from your account.',
      });
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  if (!auth) {
    return null;
  }

  return (
    <>
      {!auth.user.hasOauthGoogle && (
        <Button size="sm" onClick={onOauthGoogleLinkButtonClick}>
          Link Google account
        </Button>
      )}
      {auth.user.hasOauthGoogle && (
        <Button size="sm" variant="destructive" onClick={onOauthGoogleUnlinkButtonClick}>
          Unlink Google account
        </Button>
      )}
    </>
  );
};
