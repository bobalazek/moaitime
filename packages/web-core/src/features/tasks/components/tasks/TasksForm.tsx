import { useState } from 'react';

import { Input, useToast } from '@myzenbuddy/web-ui';

import { useTasksStore } from '../../state/tasksStore';

function TasksForm() {
  const { toast } = useToast();
  const { selectedList, addTask, listEndElement } = useTasksStore();
  const [name, setName] = useState('');

  const onKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    if (!selectedList) {
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description:
          'Oh dear, or dear. Did you, by any chance, forget to select a list? Awkward, right?',
      });

      return;
    }

    const finalName = name.trim();
    if (finalName === '') {
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description:
          'Oh dear, or dear. Did you, by any chance, forget to type something? Awkward, right?',
      });

      return;
    }

    await addTask({
      name: finalName,
      completed: false,
      listId: selectedList.id,
      // TODO: fix this bit, so we don't use any!
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    setName('');

    // We need to put it into a timeout because the element is not yet rendered,
    // so we would not scroll to the correct position.
    setTimeout(() => {
      listEndElement?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
