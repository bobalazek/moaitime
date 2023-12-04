import { Button } from '@myzenbuddy/web-ui';

import { useCommandsStore } from '../state/commandsStore';

export default function CommandsButton() {
  const { setCommandsDialogOpen } = useCommandsStore();

  return (
    <Button
      className="border-input hover:bg-accent hover:text-accent-foreground text-muted-foreground relative inline-flex h-9 w-full items-center justify-start whitespace-nowrap rounded-md border bg-gray-900 px-4 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 sm:pr-12 md:w-56 lg:w-80"
      onClick={() => {
        setCommandsDialogOpen(true);
      }}
      data-test="commands-trigger-button"
    >
      <span>Search commands...</span>
      <kbd className="bg-muted pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className='class="text-xs"'>⌘</span>K
      </kbd>
    </Button>
  );
}
