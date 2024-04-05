import { BrainCircuitIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AppButton } from '../../core/components/AppButton';

export default function FocusAppButton() {
  const navigate = useNavigate();

  return (
    <AppButton
      icon={BrainCircuitIcon}
      onClick={() => {
        navigate('/focus');
      }}
      title="Focus"
      style={{
        backgroundImage: 'linear-gradient(180deg, #FFA726 0%, #F57C00 100%)',
      }}
      data-test="focus--open-button"
    />
  );
}
