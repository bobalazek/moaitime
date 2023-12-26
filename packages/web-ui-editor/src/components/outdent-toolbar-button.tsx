import { useOutdentButton } from '@udecode/plate-indent';

import { Icons } from './icons';
import { ToolbarButton } from './toolbar';

export function OutdentToolbarButton() {
  const { props } = useOutdentButton();

  return (
    <ToolbarButton tooltip="Outdent" {...props}>
      <Icons.outdent />
    </ToolbarButton>
  );
}
