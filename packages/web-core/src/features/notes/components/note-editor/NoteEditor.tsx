import { Plate, PlateContent } from '@udecode/plate-common';
import { useEffect, useState } from 'react';

import { Note } from '@moaitime/shared-common';
import { Input } from '@moaitime/web-ui';

const initialValue = [
  {
    type: 'p',
    children: [
      {
        text: 'This is editable plain text with react and history plugins, just like a <textarea>!',
      },
    ],
  },
];

export const NoteEditor = ({ note }: { note: Note }) => {
  const [data, setData] = useState(note);

  useEffect(() => {
    setData(note);
  }, [note]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <Input
          className="p-8 text-2xl"
          placeholder="Title"
          value={data.title}
          onChange={(event) => {
            setData((current) => {
              return {
                ...current,
                title: event.target.value,
              };
            });
          }}
        />
      </div>
      <Plate initialValue={initialValue}>
        <PlateContent />
      </Plate>
    </div>
  );
};

export default NoteEditor;
