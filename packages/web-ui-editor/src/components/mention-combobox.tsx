import { ComboboxProps, Data, NoData } from '@udecode/plate-combobox';
import { getPluginOptions, useEditorRef } from '@udecode/plate-common';
import { ELEMENT_MENTION, getMentionOnSelectItem, MentionPlugin } from '@udecode/plate-mention';

import { Combobox } from './combobox';

export interface MentionComboboxProps<TData extends Data = NoData>
  extends Partial<ComboboxProps<TData>> {
  pluginKey?: string;
}

export function MentionCombobox<TData extends Data = NoData>({
  pluginKey = ELEMENT_MENTION,
  id = pluginKey,
  ...props
}: MentionComboboxProps<TData>) {
  const editor = useEditorRef();

  const { trigger } = getPluginOptions<MentionPlugin>(editor, pluginKey);

  return (
    <Combobox
      id={id}
      trigger={trigger!}
      controlled
      onSelectItem={getMentionOnSelectItem({
        key: pluginKey,
      })}
      {...props}
    />
  );
}
