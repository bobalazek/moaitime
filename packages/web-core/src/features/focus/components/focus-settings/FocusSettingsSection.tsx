import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { DEFAULT_USER_SETTINGS } from '@moaitime/shared-common';
import { Input, Label, Switch } from '@moaitime/web-ui';

import { useAuthStore, useAuthUserSetting } from '../../../auth/state/authStore';
import FocusSettingsSectionHeaderText from './FocusSettingsSectionHeaderText';

export default function FocusSettingsSection() {
  const { updateAccountSettings } = useAuthStore();

  const focusEnabled = useAuthUserSetting('focusEnabled', false);
  const focusSoundsEnabled = useAuthUserSetting('focusSoundsEnabled', false);
  const focusSessionSettings = useAuthUserSetting(
    'focusSessionSettings',
    DEFAULT_USER_SETTINGS.focusSessionSettings
  );
  const [focusSessionSettingsData, setFocusSessionSettingsData] = useState(focusSessionSettings);

  const doDebouncedSave = useDebouncedCallback(() => {
    try {
      updateAccountSettings({
        focusSessionSettings: focusSessionSettingsData,
      });
    } catch (error) {
      // Already handled in fetchJson
    }
  }, 500);

  useEffect(() => {
    setFocusSessionSettingsData(focusSessionSettings);
  }, [focusSessionSettings, doDebouncedSave]);

  return (
    <div>
      <h4 className="text-lg font-bold">
        <FocusSettingsSectionHeaderText />
      </h4>
      <p className="mb-4 text-sm text-gray-400">
        Just some visual squares to show you what day it is.
      </p>
      <div className="mb-4">
        <div className="flex items-center">
          <Switch
            id="settings-focusEnabled"
            checked={focusEnabled}
            onCheckedChange={() => {
              updateAccountSettings({
                focusEnabled: !focusEnabled,
              });
            }}
          />
          <Label htmlFor="settings-focusEnabled" className="ml-2">
            Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">Do you want to have the focus on not?</p>
      </div>
      <div className="mb-4">
        <div className="flex items-center">
          <Switch
            id="settings-focusSoundsEnabled"
            checked={focusSoundsEnabled}
            onCheckedChange={() => {
              updateAccountSettings({
                focusSoundsEnabled: !focusSoundsEnabled,
              });
            }}
          />
          <Label htmlFor="settings-focusSoundsEnabled" className="ml-2">
            Sounds Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Do you want to hear any sounds when starting or updating a focus session?
        </p>
      </div>
      <hr className="mb-4" />
      <div className="mb-4">
        <h4 className="text-lg font-bold">Default Session Settings</h4>
        <p className="mb-2 text-xs text-gray-400">
          Let's set some sensible defaults before starting a new focus session!
        </p>
        <div className="mb-2">
          <div className="w-full">
            <Label htmlFor="settings-focusSessionSettings-focusDurationSeconds">
              Focus Duration (minutes)
            </Label>
            <Input
              id="settings-focusSessionSettings-focusDurationSeconds"
              type="number"
              autoComplete="off"
              className="mt-1"
              value={focusSessionSettingsData.focusDurationSeconds / 60}
              onChange={(event) => {
                setFocusSessionSettingsData((prev) => ({
                  ...prev,
                  focusDurationSeconds: Number(event.target.value) * 60,
                }));
                doDebouncedSave();
              }}
            />
          </div>
        </div>
        <div className="mb-2">
          <div className="w-full">
            <Label htmlFor="settings-focusSessionSettings-shortBreakDurationSeconds">
              Short Break Duration (minutes)
            </Label>
            <Input
              id="settings-focusSessionSettings-shortBreakDurationSeconds"
              type="number"
              autoComplete="off"
              className="mt-1"
              value={focusSessionSettingsData.shortBreakDurationSeconds / 60}
              onChange={(event) => {
                setFocusSessionSettingsData((prev) => ({
                  ...prev,
                  shortBreakDurationSeconds: Number(event.target.value) * 60,
                }));
                doDebouncedSave();
              }}
            />
          </div>
        </div>
        <div className="mb-2">
          <div className="w-full">
            <Label htmlFor="settings-focusSessionSettings-longBreakDurationSeconds">
              Long Break Duration (minutes)
            </Label>
            <Input
              id="settings-focusSessionSettings-longBreakDurationSeconds"
              type="number"
              autoComplete="off"
              className="mt-1"
              value={focusSessionSettingsData.longBreakDurationSeconds / 60}
              onChange={(event) => {
                setFocusSessionSettingsData((prev) => ({
                  ...prev,
                  longBreakDurationSeconds: Number(event.target.value) * 60,
                }));
                doDebouncedSave();
              }}
            />
          </div>
        </div>
        <div className="mb-2">
          <div className="w-full">
            <Label htmlFor="settings-focusSessionSettings-focusRepetitionsCount">
              Focus Repetitions
            </Label>
            <Input
              id="settings-focusSessionSettingsData-focusRepetitionsCount"
              type="number"
              autoComplete="off"
              className="mt-1"
              value={focusSessionSettings.focusRepetitionsCount}
              onChange={(event) => {
                setFocusSessionSettingsData((prev) => ({
                  ...prev,
                  focusRepetitionsCount: Number(event.target.value) * 60,
                }));
                doDebouncedSave();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
