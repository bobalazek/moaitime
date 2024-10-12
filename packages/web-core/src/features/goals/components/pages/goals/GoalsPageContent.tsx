import GoalsList from '../../goals-list/GoalsList';

const GoalsPageContent = () => {
  return (
    <div className="container py-4" data-test="goals--content">
      <GoalsList />
    </div>
  );
};

export default GoalsPageContent;
