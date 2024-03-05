import HabitsDailyList from '../../habits-daily-list/HabitsDailyList';

const HabitsPageMain = () => {
  return (
    <main className="margin-auto container max-w-[960px] py-4" data-test="habits--main">
      <HabitsDailyList />
    </main>
  );
};

export default HabitsPageMain;
