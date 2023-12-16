import { UpdateTask } from '@moaitime/shared-common';

import DateSelector from '../../../core/components/partials/date-selector/DateSelector';

type TaskDialogDueDateProps = {
  data: UpdateTask;
  setData: (value: UpdateTask) => void;
};

export default function TaskDialogDueDate({ data, setData }: TaskDialogDueDateProps) {
  return (
    <DateSelector
      includeTime
      disablePast
      data={{
        date: data.dueDate ?? null,
        dateTime: data.dueDateTime ?? null,
        dateTimeZone: data.dueDateTimeZone ?? null,
      }}
      onSaveData={(saveData) => {
        setData({
          ...data,
          dueDate: saveData.date,
          dueDateTime: saveData.dateTime,
          dueDateTimeZone: saveData.dateTimeZone,
        });
      }}
    />
  );
}
