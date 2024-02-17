import { UsersIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AppButton } from '../../core/components/AppButton';

export default function SocialAppButton() {
  const navigate = useNavigate();

  return (
    <AppButton
      icon={UsersIcon}
      onClick={() => {
        navigate('/social');
      }}
      title="Social"
      data-test="social--open-button"
    />
  );
}
