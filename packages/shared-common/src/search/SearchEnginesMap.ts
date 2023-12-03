import { SearchEnginesEnum } from './SearchEnginesEnum';

export const SearchEnginesMap: Record<SearchEnginesEnum, { label: string; searchUrl: string; iconImageUrl: string }> = {
  [SearchEnginesEnum.GOOGLE]: {
    label: 'Google',
    searchUrl: 'https://www.google.com/search?q={search}',
    iconImageUrl: 'https://www.google.com/favicon.ico',
  },
  [SearchEnginesEnum.BING]: {
    label: 'Bing',
    searchUrl: 'https://www.bing.com/search?q={search}',
    iconImageUrl: 'https://www.bing.com/favicon.ico',
  },
  [SearchEnginesEnum.DUCKDUCKGO]: {
    label: 'DuckDuckGo',
    searchUrl: 'https://duckduckgo.com?q={search}',
    iconImageUrl: 'https://duckduckgo.com/favicon.ico',
  },
  [SearchEnginesEnum.ECOSIA]: {
    label: 'Ecosia',
    searchUrl: 'https://www.ecosia.org/search?q={search}',
    iconImageUrl: 'https://www.ecosia.org/favicon.ico',
  },
  [SearchEnginesEnum.YOU]: {
    label: 'You',
    searchUrl: 'https://you.com/search?q={search}',
    iconImageUrl: 'https://you.com/favicon/favicon-32x32.png',
  },
  [SearchEnginesEnum.WOLFRAMALPHA]: {
    label: 'WolframAlpha',
    searchUrl: 'https://www.wolframalpha.com/input/?i={search}',
    iconImageUrl: 'https://www.wolframalpha.com/favicon.ico',
  },
};
