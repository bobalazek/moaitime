import { useIndentButton } from '@udecode/plate-indent';

import { Icons } from './icons';
import { ToolbarButton } from './toolbar';

export function IndentToolbarButton() {
  const { props } = useIndentButton();

  return (
    <ToolbarButton tooltip="Indent" {...props}>
      <Icons.indent />
    </ToolbarButton>
  );
}
