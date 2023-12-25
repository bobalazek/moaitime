import { useEffect, useState } from 'react';

import { Note } from '@moaitime/shared-common';
import { Input } from '@moaitime/web-ui';
import { PlateEditor } from '@moaitime/web-ui-editor';

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
      <PlateEditor
        value={data.content}
        onChange={(value) => {
          setData((current) => {
            return {
              ...current,
              content: value,
            };
          });
        }}
      />
    </div>
  );
};

export default NoteEditor;
