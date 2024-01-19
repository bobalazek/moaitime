import { TerminalIcon } from 'lucide-react';

export default function CommandsSettingsSectionHeaderText() {
  return (
    <div className="flex items-center gap-2">
      <TerminalIcon />
      <span>Commands</span>
    </div>
  );
}
