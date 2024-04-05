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
      style={{
        backgroundImage: 'linear-gradient(180deg, #4DB6AC 0%, #00796B 100%)',
      }}
      data-test="social--open-button"
    />
  );
}
