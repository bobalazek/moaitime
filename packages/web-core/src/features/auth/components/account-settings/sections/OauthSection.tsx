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
    const result = window.confirm('Are you sure you want to unlink your Google account?');
    if (!result) {
      return;
    }

    try {
      await oauthUnlink(OauthProviderEnum.GOOGLE);

      sonnerToast.success('Google account unlinked', {
        description: 'Your Google account has been successfully unlinked from your account.',
      });
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  const hasOauthGoogle = auth?.user.userIdentities.some(
    (identity) => identity.providerKey === OauthProviderEnum.GOOGLE
  );

  if (!auth) {
    return null;
  }

  return (
    <>
      {!hasOauthGoogle && (
        <Button size="sm" onClick={onOauthGoogleLinkButtonClick}>
          Link Google account
        </Button>
      )}
      {hasOauthGoogle && (
        <Button size="sm" variant="destructive" onClick={onOauthGoogleUnlinkButtonClick}>
          Unlink Google account
        </Button>
      )}
    </>
  );
};
