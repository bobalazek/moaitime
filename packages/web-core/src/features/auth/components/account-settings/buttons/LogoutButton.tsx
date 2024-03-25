import { Button } from '@moaitime/web-ui';

import { useAuthStore } from '../../../state/authStore';

export const LogoutButton = () => {
  const { logout } = useAuthStore();

  const onLogoutButtonClick = async () => {
    await logout();
  };

  return (
    <Button size="sm" variant="destructive" onClick={onLogoutButtonClick}>
      Log me out
    </Button>
  );
};
