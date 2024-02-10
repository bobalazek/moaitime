// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { InfiniteData, UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { ChangelogEntry } from '@moaitime/shared-common';

import { getChangelogEntries } from '../utils/ChangelogHelpers';

export const CHANGELOG_ENTRIES_QUERY_KEY = 'changelog-entries';

export const useChangelogEntriesQuery = () => {
  return useQuery<ChangelogEntry[]>({
    queryKey: [CHANGELOG_ENTRIES_QUERY_KEY],
    queryFn: () => getChangelogEntries(),
  });
};
