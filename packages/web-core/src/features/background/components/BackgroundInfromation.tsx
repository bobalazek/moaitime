import { useBackgroundStore } from '../state/backgroundStore';

export default function BackgroundInformation() {
  const { background } = useBackgroundStore();
  if (!background) {
    return null;
  }

  return (
    <div className="pointer-events-none text-left text-xs" data-test="background-information">
      <h5 className="font-bold">{background.title}</h5>
      <h6>
        <a href={background.url} target="_blank" rel="noreferrer">
          {background.author}
        </a>
      </h6>
    </div>
  );
}
