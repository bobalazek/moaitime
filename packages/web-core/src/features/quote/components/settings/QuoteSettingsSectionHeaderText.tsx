import { FaQuoteRight } from 'react-icons/fa';

export default function QuoteSettingsSectionHeaderText() {
  return (
    <div className="flex items-center gap-2">
      <FaQuoteRight />
      <span>Quote</span>
    </div>
  );
}
