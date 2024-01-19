import type { LucideProps } from 'lucide-react';

import { AngryIcon, FrownIcon, LaughIcon, MehIcon, SmileIcon } from 'lucide-react';

import { DEFAULT_USER_SETTINGS } from '@moaitime/shared-common';

import { useAuthUserSetting } from '../../../auth/state/authStore';

export const HappinessScore = ({ score, isSelected }: { score: number; isSelected?: boolean }) => {
  const moodScores = useAuthUserSetting('moodScores', DEFAULT_USER_SETTINGS.moodScores);

  const moodScoreKey = score.toString() as keyof typeof moodScores;
  const moodScore =
    moodScoreKey in moodScores && moodScores[moodScoreKey] ? moodScores[moodScoreKey] : null;
  const label = moodScore?.label ?? 'unknown';
  const color = moodScore?.color ?? '#666666';

  return (
    <div className="flex flex-col justify-center text-center">
      <div className="flex justify-center">
        <HappinessScoreIcon
          score={score}
          color={color}
          size={48}
          strokeWidth={isSelected ? 2 : 1.5}
        />
      </div>
      <div className="mt-1.5 text-xs font-semibold">{label}</div>
    </div>
  );
};

export const HappinessScoreIcon = ({
  score,
  size = 32,
  ...rest
}: LucideProps & { score: number }) => {
  const moodScores = useAuthUserSetting('moodScores', DEFAULT_USER_SETTINGS.moodScores);

  const moodScoreKey = score.toString() as keyof typeof moodScores;
  const moodScore =
    moodScoreKey in moodScores && moodScores[moodScoreKey] ? moodScores[moodScoreKey] : null;
  const color = moodScore?.color ?? '#666666';

  if (score === -2) {
    return <AngryIcon size={size} color={color} {...rest} />;
  } else if (score === -1) {
    return <FrownIcon size={size} color={color} {...rest} />;
  } else if (score === 1) {
    return <SmileIcon size={size} color={color} {...rest} />;
  } else if (score === 2) {
    return <LaughIcon size={size} color={color} {...rest} />;
  }

  return <MehIcon size={size} color={color} {...rest} />;
};
