import { clsx } from 'clsx';

import { UserLimits, UserUsage } from '@moaitime/shared-common';
import { Badge } from '@moaitime/web-ui';

import { useUserLimitsAndUsageStore } from '../../auth/state/userLimitsAndUsageStore';

export type UsageBadgeProps = {
  limitKey: keyof UserLimits;
  usageKey?: keyof UserUsage;
  usageValue?: number;
};

export default function UsageBadge({ limitKey, usageKey, usageValue }: UsageBadgeProps) {
  const { userLimits, userUsage } = useUserLimitsAndUsageStore();

  if (!userLimits || !userUsage) {
    return null;
  }

  const used = usageValue ?? (usageKey ? userUsage[usageKey] : null);
  if (used === null) {
    return null;
  }

  const limit = userLimits[limitKey];

  const isAlmostUsed = used >= limit * 0.8;

  return (
    <div className="inline-block">
      <Badge
        variant={used === limit ? 'destructive' : isAlmostUsed ? 'warn' : 'outline'}
        className={clsx('px-[4px] py-[2px] text-xs')}
      >
        Used: {used} / {limit}
      </Badge>
    </div>
  );
}
