import { Button } from '@moaitime/web-ui';

import { useCommandsStore } from '../state/commandsStore';

export default function CommandsButton() {
  const { setCommandsDialogOpen } = useCommandsStore();

  const shortcutText = navigator.userAgent.includes('Mac OS X') ? '⌘ K' : 'Ctrl K';

  return (
    <Button
      className="border-input text-muted-foreground relative inline-flex h-9 w-full items-center justify-start rounded-md px-4 py-2 text-sm shadow-sm transition-colors sm:pr-12 md:w-56 lg:w-80"
      onClick={() => {
        setCommandsDialogOpen(true);
      }}
      data-test="commands-trigger-button"
    >
      <span>Search commands ...</span>
      <kbd className="bg-muted pointer-events-none absolute right-2 top-2 hidden select-none items-center gap-1 rounded border px-2 font-mono text-[10px] opacity-100 sm:flex">
        {shortcutText}
      </kbd>
    </Button>
  );
}
