import { Button, Input } from '@moaitime/web-ui';

const FocusPageMain = () => {
  return (
    <main className="h-full w-full flex-grow overflow-auto p-4" data-test="focus--main">
      <div className="margin-auto container text-center">
        <div className="my-3 text-3xl">I want to work on</div>
        <Input
          className="m-auto w-full rounded-lg px-12 py-8 text-center text-2xl lg:w-[640px]"
          placeholder="something cool"
        />
        <div className="my-3 text-xl">for</div>
        <Input
          className="m-auto w-full rounded-lg px-12 py-8 text-center text-2xl lg:w-[640px]"
          placeholder="25 minutes"
        />
        <div className="my-3 text-xl">and then take a break for</div>
        <Input
          className="m-auto w-full rounded-lg px-12 py-8 text-center text-2xl lg:w-[640px]"
          placeholder="5 minutes"
        />
        <Button className="mt-10 h-20 px-12 text-5xl uppercase">Let's go! 🚀</Button>
      </div>
    </main>
  );
};

export default FocusPageMain;
