import { SearchIcon } from 'lucide-react';

export default function SearchSettingsSectionHeaderText() {
  return (
    <div className="flex items-center gap-2">
      <SearchIcon />
      <span>Search</span>
    </div>
  );
}
