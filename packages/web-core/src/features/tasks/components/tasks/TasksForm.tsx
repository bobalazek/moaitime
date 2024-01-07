import { useRef, useState } from 'react';

import { Input, sonnerToast } from '@moaitime/web-ui';

import { useListsStore } from '../../state/listsStore';
import { useTasksStore } from '../../state/tasksStore';

function TasksForm() {
  const { addTask, listEndElement } = useTasksStore();
  const { selectedList } = useListsStore();
  const [name, setName] = useState('');
  const isSubmittingRef = useRef(false);

  // TODO: implement loader to prevent submitting if the task is still being added

  const onKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    if (!selectedList) {
      sonnerToast.error('Oops!', {
        description:
          'Oh dear, or dear. Did you, by any chance, forget to select a list? Awkward, right?',
        position: 'top-right',
      });

      return;
    }

    const finalName = name.trim();
    if (finalName === '') {
      sonnerToast.error('Oops!', {
        description:
          'Oh dear, or dear. Did you, by any chance, forget to type something? Awkward, right?',
        position: 'top-right',
      });

      return;
    }

    try {
      isSubmittingRef.current = true;

      await addTask({
        name: finalName,
        listId: selectedList.id,
      });

      setName('');

      // We need to put it into a timeout because the element is not yet rendered,
      // so we would not scroll to the correct position.
      setTimeout(() => {
        listEndElement?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="pt-2" data-test="tasks--tasks-form">
      <Input
        type="text"
        placeholder='Add a task and press "Enter"'
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
        onKeyPress={onKeyPress}
      />
    </div>
  );
}

export default TasksForm;
