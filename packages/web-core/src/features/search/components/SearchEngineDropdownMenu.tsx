import { SearchEnginesEnum, SearchEnginesMap } from '@moaitime/shared-common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@moaitime/web-ui';

import { useAuthStore } from '../../auth/state/authStore';

export default function SearchEngineDropdownMenu() {
  const { auth, updateAccountSettings } = useAuthStore();
  const searchEngine = auth?.user?.settings?.searchEngine ?? SearchEnginesEnum.GOOGLE;
  const selectedSearchEngine = SearchEnginesMap[searchEngine]
    ? searchEngine
    : SearchEnginesEnum.GOOGLE;
  const selectedSearchEngineIconImageUrl = SearchEnginesMap[selectedSearchEngine].iconImageUrl;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 transform text-xl text-gray-400"
          data-test="search-engine-dropdown-menu-trigger-button"
        >
          <img src={selectedSearchEngineIconImageUrl} className="h-6 w-6" alt="Search logo" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent data-test="search-engine-dropdown-menu">
        <DropdownMenuLabel>Search Engines</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={selectedSearchEngine}
          onValueChange={(value) => {
            updateAccountSettings({
              searchEngine: value as SearchEnginesEnum,
            });
          }}
        >
          {Object.keys(SearchEnginesMap).map((searchEngineKey) => {
            const searchEngine = searchEngineKey as SearchEnginesEnum;
            const searchEngineLabel = SearchEnginesMap[searchEngine].label;
            const SearchEngineIconImageUrl = SearchEnginesMap[searchEngine].iconImageUrl;

            return (
              <DropdownMenuRadioItem
                key={searchEngine}
                value={searchEngine}
                className="cursor-pointer"
              >
                <img src={SearchEngineIconImageUrl} className="mr-2 h-4 w-4" alt="Search logo" />
                {searchEngineLabel}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
