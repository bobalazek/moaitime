import { useBackgroundStore } from '../state/backgroundStore';

export default function BackgroundInformation() {
  const { background, setRandomBackground } = useBackgroundStore();
  if (!background) {
    return null;
  }

  return (
    <div className="text-left text-xs" data-test="background-information">
      <h5
        className="cursor-default font-bold"
        onDoubleClick={() => {
          setRandomBackground();
        }}
      >
        {background.title}
      </h5>
      <h6>
        <a href={background.url} target="_blank" rel="noreferrer">
          {background.author}
        </a>
      </h6>
    </div>
  );
}
