import { Button, Input } from '@moaitime/web-ui';

const FocusPageMain = () => {
  return (
    <main className="h-full w-full flex-grow overflow-auto p-4" data-test="focus--main">
      <div className="margin-auto container text-center text-2xl">
        <div className="mt-8 flex flex-col gap-4">
          <div>I want to work on</div>
          <Input
            className="m-auto w-full rounded-lg px-12 py-8 text-center text-2xl lg:w-[640px]"
            placeholder="something cool"
          />
          <div className="flex flex-row items-center justify-center gap-3">
            <div>for exactly</div>
            <Input
              className="w-20 rounded-lg px-2 py-6 text-center text-2xl"
              defaultValue="25"
              min="1"
              max="3600"
            />
            <div>minutes</div>
          </div>
          <div className="flex flex-row items-center justify-center gap-3">
            <div>
              and then take a <b>break</b> of
            </div>
            <Input
              className="w-20 rounded-lg px-2 py-6 text-center text-2xl"
              defaultValue="5"
              min="1"
              max="3600"
            />
            <div>minutes.</div>
          </div>
          <div className="flex flex-row items-center justify-center gap-3">
            <div>
              I want to <b>repeat</b> this
            </div>
            <Input
              className="w-20 rounded-lg px-2 py-6 text-center text-2xl"
              defaultValue="4"
              min="1"
              max="20"
            />
            <div>times,</div>
          </div>
          <div className="flex flex-row items-center justify-center gap-3">
            <div>
              until I will have a <b>longer break</b> of
            </div>
            <Input
              className="w-20 rounded-lg px-2 py-6 text-center text-2xl"
              defaultValue="30"
              min="1"
              max="3600"
            />
            <div>minutes.</div>
          </div>
        </div>
        <Button className="mt-8 h-20 px-12 text-3xl uppercase">Let's go! 🚀</Button>
      </div>
    </main>
  );
};

export default FocusPageMain;
