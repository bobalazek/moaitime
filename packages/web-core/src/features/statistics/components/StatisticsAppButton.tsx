import { BarChart4Icon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AppButton } from '../../core/components/AppButton';

export default function StatisticsAppButton() {
  const navigate = useNavigate();

  return (
    <AppButton
      icon={BarChart4Icon}
      onClick={() => {
        navigate('/statistics');
      }}
      title="Statistics"
      style={{
        backgroundImage: 'linear-gradient(180deg, #66BB6A 0%, #388E3C 100%)',
      }}
      data-test="statistics--open-button"
    />
  );
}
