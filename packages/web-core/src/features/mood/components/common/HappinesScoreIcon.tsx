import type { LucideProps } from 'lucide-react';

import { AngryIcon, FrownIcon, LaughIcon, MehIcon, SmileIcon } from 'lucide-react';

export const HappinessScoreIcon = ({
  score,
  size = 32,
  ...rest
}: LucideProps & { score: number }) => {
  if (score === -2) {
    return <AngryIcon size={size} color="#EF4444" {...rest} />;
  } else if (score === -1) {
    return <FrownIcon size={size} color="#F97316" {...rest} />;
  } else if (score === 1) {
    return <SmileIcon size={size} color="#84CC16" {...rest} />;
  } else if (score === 2) {
    return <LaughIcon size={size} color="#10B981" {...rest} />;
  }

  return <MehIcon size={size} color="#3B82F6" {...rest} />;
};
