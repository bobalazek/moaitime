import { SendIcon } from 'lucide-react';
import { KeyboardEvent, useRef, useState } from 'react';

import { Button, Input, sonnerToast } from '@moaitime/web-ui';

import { useListsStore } from '../../state/listsStore';
import { useTasksStore } from '../../state/tasksStore';

function TasksForm({ parentId }: { parentId?: string }) {
  const { addTask, listEndElement } = useTasksStore();
  const { selectedList } = useListsStore();
  const [name, setName] = useState('');
  const isSubmittingRef = useRef(false);

  const onSaveButtonClick = async () => {
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
        listId: selectedList?.id,
        parentId,
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

  const onKeyPress = async (event: KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();

    if (event.key === 'Enter') {
      await onSaveButtonClick();
    }
  };

  return (
    <div
      className="bg-background border-t p-2"
      data-parent-id={parentId}
      data-test="tasks--tasks-form"
    >
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="What needs to be done?"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          onKeyPress={onKeyPress}
          enterKeyHint="enter"
        />
        <Button
          variant="default"
          onClick={async () => {
            await onSaveButtonClick();
          }}
        >
          <SendIcon size={16} />
        </Button>
      </div>
    </div>
  );
}

export default TasksForm;
