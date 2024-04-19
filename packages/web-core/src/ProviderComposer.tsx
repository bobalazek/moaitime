type ProviderTuple = [React.JSXElementConstructor<React.PropsWithChildren<unknown>>, object];
interface ProviderComposerProps {
  providers: Array<ProviderTuple | undefined>;
  children: React.ReactNode;
}

export function ProviderComposer({ providers, children }: ProviderComposerProps) {
  const filteredProviders = providers.filter((val) => {
    return !!val;
  }) as Array<ProviderTuple>;

  return (
    <>
      {filteredProviders.reduceRight((acc, [Component, props]) => {
        return <Component {...props}>{acc}</Component>;
      }, children)}
    </>
  );
}
