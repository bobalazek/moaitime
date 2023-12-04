import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import { SearchEnginesMap } from '@myzenbuddy/shared-common';
import { Input } from '@myzenbuddy/web-ui';

import { useSettingsStore } from '../../settings/state/settingsStore';
import SearchEngineDropdownMenu from './SearchEngineDropdownMenu';

export default function SearchInput() {
  const { settings } = useSettingsStore();
  const [search, setSearch] = useState('');

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 transform text-xl text-gray-400" />
        <Input
          className="w-full rounded-full px-12 py-7 text-3xl shadow-2xl lg:w-[640px]"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search"
          onKeyPress={(event) => {
            if (event.key !== 'Enter') {
              return;
            }

            const url = SearchEnginesMap[settings.searchEngine].searchUrl.replace(
              '{search}',
              search
            );

            window.open(url, '_blank');
          }}
        />
        <SearchEngineDropdownMenu />
      </div>
    </div>
  );
}
