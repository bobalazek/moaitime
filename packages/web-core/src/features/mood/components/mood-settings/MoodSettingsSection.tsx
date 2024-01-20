import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { DEFAULT_USER_SETTINGS, MOOD_SCORES } from '@moaitime/shared-common';
import { Button, Input, Label, Switch } from '@moaitime/web-ui';

import { useAuthStore, useAuthUserSetting } from '../../../auth/state/authStore';
import { ColorSelector } from '../../../core/components/selectors/ColorSelector';
import MoodSettingsSectionHeaderText from '../mood-settings/MoodSettingsSectionHeaderText';

export default function MoodSettingsSection() {
  const { updateAccountSettings } = useAuthStore();
  const moodEnabled = useAuthUserSetting('moodEnabled', false);
  const moodSoundsEnabled = useAuthUserSetting('moodSoundsEnabled', false);
  const moodScores = useAuthUserSetting('moodScores', DEFAULT_USER_SETTINGS.moodScores);
  // The only reason we need this is, because we are debouncing the label change, meaning a controlled input woulnd't be updated in real time otherwise
  const [moodScoresData, setMoodScoresData] = useState(moodScores);

  useEffect(() => {
    setMoodScoresData(moodScores);
  }, [moodScores]);

  const onDebouncedLabelChange = useDebouncedCallback((score: number, value: string) => {
    try {
      updateAccountSettings({
        moodScores: {
          ...moodScores,
          [score]: {
            ...(moodScores[score] ?? {}),
            label: value,
          },
        },
      });
    } catch (error) {
      // Already handled in fetchJson
    }
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
    try {
      updateAccountSettings({
        moodScores: {
          ...moodScores,
          [score]: {
            ...(moodScores[score] ?? {}),
            color: value,
          },
        },
      });
    } catch (error) {
      // Already handled in fetchJson
    }
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
      <div className="mb-4">
        <div className="flex items-center">
          <Switch
            id="settings-moodSoundsEnabled"
            checked={moodSoundsEnabled}
            onCheckedChange={() => {
              updateAccountSettings({
                moodSoundsEnabled: !moodSoundsEnabled,
              });
            }}
          />
          <Label htmlFor="settings-moodSoundsEnabled" className="ml-2">
            Sounds Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Do you want to hear any sounds when adding a mood?
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
                  value={moodScores[score]?.color}
                  onChangeValue={(value) => {
                    onColorChange(score, value!);
                  }}
                  disableClear
                  allowCustomColors
                />
              </div>
            </div>
          ))}
        </div>
        <Button onClick={onResetButtonClick}>Reset to original</Button>
      </div>
    </div>
  );
}