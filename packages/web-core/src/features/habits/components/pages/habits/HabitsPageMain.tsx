import HabitsGrid from '../../habits-grid/HabitsGrid';

const HabitsPageMain = () => {
  return (
    <main className="h-full w-full flex-grow overflow-auto p-4" data-test="habits--main">
      <div className="margin-auto container text-center text-2xl">
        <HabitsGrid />
      </div>
    </main>
  );
};

export default HabitsPageMain;
