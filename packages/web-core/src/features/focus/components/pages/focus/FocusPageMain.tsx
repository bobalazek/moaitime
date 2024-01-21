import CreateFocusSessionForm from '../../create-focus-session-form/CreateFocusSessionForm';

const FocusPageMain = () => {
  return (
    <main className="h-full w-full flex-grow overflow-auto p-4" data-test="focus--main">
      <div className="margin-auto container text-center text-2xl">
        <CreateFocusSessionForm />
      </div>
    </main>
  );
};

export default FocusPageMain;
