import { useFocusSessionsStore } from '../../../state/focusSessionsStore';
import CreateFocusSessionForm from '../../create-focus-session-form/CreateFocusSessionForm';
import CurrentFocusSession from '../../current-focus-session/CurrentFocusSession';

const FocusPageMain = () => {
  const { currentFocusSession } = useFocusSessionsStore();

  return (
    <main className="h-full w-full flex-grow overflow-auto p-4" data-test="focus--main">
      <div className="margin-auto container text-center">
        {currentFocusSession && <CurrentFocusSession />}
        {!currentFocusSession && <CreateFocusSessionForm />}
      </div>
    </main>
  );
};

export default FocusPageMain;
