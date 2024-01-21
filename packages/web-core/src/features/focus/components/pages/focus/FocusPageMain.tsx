import { useFocusSessionsStore } from '../../../state/focusSessionsStore';
import ActiveFocusSession from '../../active-focus-session/ActiveFocusSession';
import CreateFocusSessionForm from '../../create-focus-session-form/CreateFocusSessionForm';

const FocusPageMain = () => {
  const { activeFocusSession } = useFocusSessionsStore();

  return (
    <main className="h-full w-full flex-grow overflow-auto p-4" data-test="focus--main">
      <div className="margin-auto container text-center text-2xl">
        {activeFocusSession && <ActiveFocusSession />}
        {!activeFocusSession && <CreateFocusSessionForm />}
      </div>
    </main>
  );
};

export default FocusPageMain;
