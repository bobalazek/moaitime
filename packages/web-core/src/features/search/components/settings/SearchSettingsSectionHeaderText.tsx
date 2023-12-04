import { FaSearch } from 'react-icons/fa';

export default function SearchSettingsSectionHeaderText() {
  return (
    <div className="flex items-center gap-2">
      <FaSearch />
      <span>Search</span>
    </div>
  );
}
