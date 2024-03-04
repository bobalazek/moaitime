import HabitsDailyList from '../../habits-daily-list/HabitsDailyList';

const HabitsPageMain = () => {
  return (
    <main className="h-full w-full flex-grow overflow-auto p-4" data-test="habits--main">
      <div className="margin-auto container">
        <HabitsDailyList />
      </div>
    </main>
  );
};

export default HabitsPageMain;
