import { FaTerminal } from 'react-icons/fa';

export default function CommandsSettingsSectionHeaderText() {
  return (
    <div className="flex items-center gap-2">
      <FaTerminal />
      <span>Commands</span>
    </div>
  );
}
