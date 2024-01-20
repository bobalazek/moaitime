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
      data-test="focus--open-button"
    />
  );
}
