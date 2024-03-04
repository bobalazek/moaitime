import HabitsDailyList from '../../habits-daily-list/HabitsDailyList';

const HabitsPageMain = () => {
  return (
    <main className="h-full w-full flex-grow overflow-auto p-4" data-test="habits--main">
      <div className="margin-auto container text-center text-2xl">
        <HabitsDailyList />
      </div>
    </main>
  );
};

export default HabitsPageMain;
