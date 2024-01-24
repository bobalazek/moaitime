import { clsx } from 'clsx';

import { UserLimits, UserUsage } from '@moaitime/shared-common';
import { Badge } from '@moaitime/web-ui';

import { useUserLimitsAndUsageStore } from '../../auth/state/userLimitsAndUsageStore';

export default function UsageBadge({
  limitKey,
  usageKey,
  usageValue,
}: {
  limitKey: keyof UserLimits;
  usageKey?: keyof UserUsage;
  usageValue?: number;
}) {
  const { userLimits, userUsage } = useUserLimitsAndUsageStore();

  if (!userLimits || !userUsage) {
    return null;
  }

  const used = usageValue ?? (usageKey ? userUsage[usageKey] : null);
  if (used === null) {
    return null;
  }

  const limit = userLimits[limitKey];

  return (
    <Badge variant="outline" className={clsx('ml-2 px-1.5 py-0 text-[0.65rem]')}>
      Used: {used} / {limit}
    </Badge>
  );
}
