import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

import { SearchEnginesEnum, SearchEnginesMap } from '@moaitime/shared-common';
import { Input } from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../auth/state/authStore';
import SearchEngineDropdownMenu from './SearchEngineDropdownMenu';

export default function SearchInput() {
  const [search, setSearch] = useState('');

  const searchEngine = useAuthUserSetting('searchEngine', SearchEnginesEnum.GOOGLE);

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 transform text-xl text-gray-400" />
        <Input
          className="w-full rounded-full px-12 py-4 shadow-2xl md:py-7 md:text-3xl lg:w-[640px]"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search"
          onKeyPress={(event) => {
            if (event.key !== 'Enter') {
              return;
            }

            const url = SearchEnginesMap[searchEngine].searchUrl.replace('{search}', search);

            window.open(url, '_blank');
          }}
        />
        <SearchEngineDropdownMenu />
      </div>
    </div>
  );
}
