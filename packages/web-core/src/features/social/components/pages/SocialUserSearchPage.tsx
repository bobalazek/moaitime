import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import { Input } from '@moaitime/web-ui';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useEscapeToHome } from '../../../core/hooks/useEscapeToHome';
import UserSearch from '../user-search/UserSearch';
import SocialPageHeader from './layout/SocialPageHeader';

export default function SocialUserSearchPage() {
  useEscapeToHome();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('query') ?? '');
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('query', debouncedSearch);

    navigate(`${url.pathname}${url.search}`, { replace: true });
  }, [debouncedSearch, navigate]);

  useEffect(() => {
    document.title = `User Search | Social | MoaiTime`;
  }, []);

  return (
    <ErrorBoundary>
      <div className="flex h-screen flex-col" data-test="social--user-search">
        <SocialPageHeader />
        <div className="container m-auto max-w-[960px] flex-grow py-4">
          <h1 className="mb-4 text-3xl font-semibold">Search for Friends</h1>
          <Input
            autoFocus
            className="w-full rounded-xl px-12 py-7 text-xl"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Display Name or Username"
          />
          <hr className="my-6" />
          {debouncedSearch && <UserSearch query={debouncedSearch} />}
          {!debouncedSearch && (
            <div className="text-muted-foreground text-center text-xl">
              Being productive is fun, but you know what is more fun? Connecting with people, so go
              ahead! Search for someone and connect with them.
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
