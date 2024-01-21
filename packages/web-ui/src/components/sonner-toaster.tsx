import { Toaster } from 'sonner';

type SonnerToasterProps = React.ComponentProps<typeof Toaster>;

const SonnerToaster = ({ theme = 'system', ...props }: SonnerToasterProps) => {
  return (
    <Toaster
      richColors
      theme={theme as SonnerToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          // https://github.com/shadcn-ui/ui/issues/2401
          // A wonky hack to at least make the button clickable.
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:pointer-events-auto',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { SonnerToaster };
