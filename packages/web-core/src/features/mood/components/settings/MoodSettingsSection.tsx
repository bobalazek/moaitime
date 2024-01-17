import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { DEFAULT_USER_SETTINGS, MOOD_SCORES } from '@moaitime/shared-common';
import { Button, Input, Label, Switch } from '@moaitime/web-ui';

import { useAuthStore, useAuthUserSetting } from '../../../auth/state/authStore';
import { ColorSelector } from '../../../core/components/selectors/ColorSelector';
import MoodSettingsSectionHeaderText from './MoodSettingsSectionHeaderText';

export default function MoodSettingsSection() {
  const { updateAccountSettings } = useAuthStore();
  const moodEnabled = useAuthUserSetting('moodEnabled', false);
  const moodScores = useAuthUserSetting('moodScores', DEFAULT_USER_SETTINGS.moodScores);
  const [moodScoresData, setMoodScoresData] = useState(moodScores);

  useEffect(() => {
    setMoodScoresData(moodScores);
  }, [moodScores]);

  const onDebouncedLabelChange = useDebouncedCallback((score: number, value: string) => {
    updateAccountSettings({
      moodScores: {
        ...moodScores,
        [score]: {
          ...(moodScores[score] ?? {}),
          label: value,
        },
      },
    });
  }, 500);

  const onLabelCange = (score: number, value: string) => {
    setMoodScoresData((current) => ({
      ...current,
      [score]: {
        ...(current[score] ?? {}),
        label: value,
      },
    }));

    onDebouncedLabelChange(score, value);
  };

  const onColorChange = (score: number, value: string) => {
    updateAccountSettings({
      moodScores: {
        ...moodScores,
        [score]: {
          ...(moodScores[score] ?? {}),
          color: value,
        },
      },
    });
  };

  const onResetButtonClick = () => {
    updateAccountSettings({
      moodScores: DEFAULT_USER_SETTINGS.moodScores,
    });
  };

  return (
    <div>
      <h4 className="text-lg font-bold">
        <MoodSettingsSectionHeaderText />
      </h4>
      <p className="mb-4 text-sm text-gray-400">
        Just some visual squares to show you what day it is.
      </p>
      <div className="mb-4">
        <div className="flex items-center">
          <Switch
            id="settings-moodEnabled"
            checked={moodEnabled}
            onCheckedChange={() => {
              updateAccountSettings({
                moodEnabled: !moodEnabled,
              });
            }}
          />
          <Label htmlFor="settings-moodEnabled" className="ml-2">
            Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Are you in the mood (sorry, not sorry) for some mood tracking?
        </p>
      </div>
      <hr className="mb-4" />
      <div className="mb-4">
        <h4 className="text-lg font-bold">Scores</h4>
        <p className="mb-2 text-xs text-gray-400">Want to spice things up a bit?</p>
        <div className="mb-2 flex w-full flex-col">
          {MOOD_SCORES.map((score) => (
            <div key={score} className="mb-2 flex">
              <div className="ml-2 w-full">
                <Input
                  value={moodScoresData[score]?.label}
                  onChange={(event) => {
                    onLabelCange(score, event.target.value);
                  }}
                />
              </div>
              <div className="ml-2 w-full">
                <ColorSelector
                  value={moodScoresData[score]?.color}
                  onChangeValue={(value) => {
                    onColorChange(score, value!);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <Button
          onClick={() => {
            onResetButtonClick();
          }}
        >
          Reset to original
        </Button>
      </div>
    </div>
  );
}
