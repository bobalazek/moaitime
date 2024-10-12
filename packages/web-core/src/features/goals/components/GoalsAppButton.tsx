import { TargetIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AppButton } from '../../core/components/AppButton';

export default function GoalsAppButton() {
  const navigate = useNavigate();

  return (
    <AppButton
      icon={TargetIcon}
      onClick={() => {
        navigate('/goals');
      }}
      title="Goals"
      style={{
        backgroundImage: 'linear-gradient(135deg, #3F51B5 0%, #2196F3 50%, #03A9F4 100%)',
      }}
      data-test="goals--open-button"
    />
  );
}
