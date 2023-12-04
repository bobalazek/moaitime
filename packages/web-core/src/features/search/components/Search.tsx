import { ErrorBoundary } from '../../core/components/ErrorBoundary';
import SearchInput from './SearchInput';

export default function Search() {
  return (
    <ErrorBoundary>
      <div data-test="search">
        <SearchInput />
      </div>
    </ErrorBoundary>
  );
}
