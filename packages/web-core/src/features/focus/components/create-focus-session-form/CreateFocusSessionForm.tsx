import { useState } from 'react';

import { CreateFocusSession } from '@moaitime/shared-common';
import { Button, cn, Input } from '@moaitime/web-ui';

import { TaskAutocomplete } from '../../../core/components/selectors/TaskAutocomplete';
import { useFocusSessionsStore } from '../../state/focusSessionsStore';

export default function CreateFocusSessionForm() {
  const { addFocusSession } = useFocusSessionsStore();
  const [data, setData] = useState<CreateFocusSession>({
    taskText: '',
    taskId: null,
    settings: {
      focusDurationSeconds: 25 * 60,
      shortBreakDurationSeconds: 5 * 60,
      longBreakDurationSeconds: 30 * 60,
      focusRepetitionsCount: 4,
    },
  });

  const onSubmitButtonClick = async () => {
    try {
      await addFocusSession(data);
    } catch (error) {
      // Already handled
    }
  };

  return (
    <div>
      <div className="mt-8 flex flex-col gap-4">
        <div>I want to work on</div>
        <div className="flex justify-center">
          <TaskAutocomplete
            inputWrapperClassName={cn('max-w-[480px]')}
            inputClassName={cn('rounded-lg px-12 py-8 text-center text-2xl')}
            value={data.taskText ?? null}
            onChangeValue={(value) => {
              setData((current) => ({
                ...current,
                taskText: value,
              }));
            }}
            taskId={data.taskId ?? undefined}
            onSelectTask={(taskId) => {
              setData((current) => ({
                ...current,
                taskId: taskId,
              }));
            }}
          />
        </div>
        <div className="flex flex-row items-center justify-center gap-3">
          <div>for exactly</div>
          <Input
            type="number"
            className="w-24 rounded-lg px-2 py-6 text-center text-2xl"
            value={data.settings.focusDurationSeconds / 60}
            onChange={(event) => {
              setData((current) => ({
                ...current,
                settings: {
                  ...current.settings,
                  focusDurationSeconds: Number(event.target.value) * 60,
                },
              }));
            }}
            min="1"
            max="3600"
          />
          <div>minutes</div>
        </div>
        <div className="flex flex-row items-center justify-center gap-3">
          <div>
            and then take a <b>break</b> of
          </div>
          <Input
            type="number"
            className="w-24 rounded-lg px-2 py-6 text-center text-2xl"
            value={data.settings.shortBreakDurationSeconds / 60}
            onChange={(event) => {
              setData((current) => ({
                ...current,
                settings: {
                  ...current.settings,
                  shortBreakDurationSeconds: Number(event.target.value) * 60,
                },
              }));
            }}
            min="1"
            max="3600"
          />
          <div>minutes.</div>
        </div>
        <div className="flex flex-row items-center justify-center gap-3">
          <div>
            I want to <b>repeat</b> this
          </div>
          <Input
            type="number"
            className="w-24 rounded-lg px-2 py-6 text-center text-2xl"
            value={data.settings.focusRepetitionsCount ?? 4}
            onChange={(event) => {
              setData((current) => ({
                ...current,
                settings: {
                  ...current.settings,
                  focusRepetitionsCount: Number(event.target.value),
                },
              }));
            }}
            min="1"
            max="20"
          />
          <div>times,</div>
        </div>
        <div className="flex flex-row items-center justify-center gap-3">
          <div>
            until I will have a <b>longer break</b> of
          </div>
          <Input
            type="number"
            className="w-24 rounded-lg px-2 py-6 text-center text-2xl"
            value={data.settings?.longBreakDurationSeconds / 60}
            onChange={(event) => {
              setData((current) => ({
                ...current,
                settings: {
                  ...current.settings,
                  longBreakDurationSeconds: Number(event.target.value) * 60,
                },
              }));
            }}
            min="1"
            max="3600"
          />
          <div>minutes.</div>
        </div>
      </div>
      <Button className="mt-8 h-20 px-12 text-3xl uppercase" onClick={onSubmitButtonClick}>
        Let's go! 🚀
      </Button>
    </div>
  );
}
