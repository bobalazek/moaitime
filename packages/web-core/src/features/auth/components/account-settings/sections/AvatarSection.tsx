import { useRef } from 'react';

import { Button } from '@moaitime/web-ui';

import { UserAvatar } from '../../../../core/components/UserAvatar';
import { useAuthStore } from '../../../state/authStore';

export const AvatarSection = () => {
  const { auth, deleteAccountAvatar, uploadAccountAvatar } = useAuthStore();
  const avatarImageInputRef = useRef<HTMLInputElement>(null);

  const onAvatarImageUploadButtonClick = async () => {
    avatarImageInputRef.current?.click();
  };

  const onAvatarImageRemoveButtonClick = async () => {
    const result = confirm('Are you sure you want to remove your avatar?');
    if (!result) {
      return;
    }

    try {
      await deleteAccountAvatar();
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    } finally {
      avatarImageInputRef.current!.value = '';
    }
  };

  const onAvatarImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      await uploadAccountAvatar(file);
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    } finally {
      avatarImageInputRef.current!.value = '';
    }
  };

  if (!auth) {
    return null;
  }

  return (
    <>
      <UserAvatar user={auth.user} />
      <div className="flex gap-1">
        <Button size="sm" variant="outline" onClick={onAvatarImageUploadButtonClick}>
          {auth.user.avatarImageUrl && <>Change Photo</>}
          {!auth.user.avatarImageUrl && <>Upload Photo</>}
        </Button>
        {auth.user.avatarImageUrl && (
          <Button size="sm" variant="destructive" onClick={onAvatarImageRemoveButtonClick}>
            Remove Photo
          </Button>
        )}
        <input
          ref={avatarImageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onAvatarImageChange}
        />
      </div>
    </>
  );
};
