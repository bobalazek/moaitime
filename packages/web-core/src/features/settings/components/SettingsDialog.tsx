import clsx from 'clsx';
import { useState } from 'react';

import { Dialog, DialogContent } from '@myzenbuddy/web-ui';

import AuthSettingsSection from '../../auth/components/settings/AuthSettingsSection';
import AuthSettingsSectionHeaderText from '../../auth/components/settings/AuthSettingsSectionHeaderText';
import CalendarSettingsSection from '../../calendar/components/settings/CalendarSettingsSection';
import CalendarSettingsSectionHeaderText from '../../calendar/components/settings/CalendarSettingsSectionHeaderText';
import ClockSettingsSection from '../../clock/components/settings/ClockSettingsSection';
import ClockSettingsSectionHeaderText from '../../clock/components/settings/ClockSettingsSectionHeaderText';
import CommandsSettingsSection from '../../commands/components/settings/CommandsSettingsSection';
import CommandsSettingsSectionHeaderText from '../../commands/components/settings/CommandsSettingsSectionHeaderText';
import GreetingSettingsSection from '../../greeting/components/settings/GreetingSettingsSection';
import GreetingSettingsSectionHeaderText from '../../greeting/components/settings/GreetingSettingsSectionHeaderText';
import QuoteSettingsSection from '../../quote/components/settings/QuoteSettingsSection';
import QuoteSettingsSectionHeaderText from '../../quote/components/settings/QuoteSettingsSectionHeaderText';
import SearchSettingsSection from '../../search/components/settings/SearchSettingsSection';
import SearchSettingsSectionHeaderText from '../../search/components/settings/SearchSettingsSectionHeaderText';
import TasksSettingsSection from '../../tasks/components/settings/TasksSettingsSection';
import TasksSettingsSectionHeaderText from '../../tasks/components/settings/TasksSettingsSectionHeaderText';
import WeatherSettingsSection from '../../weather/components/settings/WeatherSettingsSection';
import WeatherSettingsSectionHeaderText from '../../weather/components/settings/WeatherSettingsSectionHeaderText';
import { useSettingsStore } from '../state/settingsStore';

const tabs = [
  {
    id: 'auth',
    label: <AuthSettingsSectionHeaderText />,
    content: <AuthSettingsSection />,
  },
  {
    id: 'weather',
    label: <WeatherSettingsSectionHeaderText />,
    content: <WeatherSettingsSection />,
  },
  {
    id: 'calendar',
    label: <CalendarSettingsSectionHeaderText />,
    content: <CalendarSettingsSection />,
  },
  {
    id: 'clock',
    label: <ClockSettingsSectionHeaderText />,
    content: <ClockSettingsSection />,
  },
  {
    id: 'greeting',
    label: <GreetingSettingsSectionHeaderText />,
    content: <GreetingSettingsSection />,
  },
  {
    id: 'quote',
    label: <QuoteSettingsSectionHeaderText />,
    content: <QuoteSettingsSection />,
  },
  {
    id: 'search',
    label: <SearchSettingsSectionHeaderText />,
    content: <SearchSettingsSection />,
  },
  {
    id: 'tasks',
    label: <TasksSettingsSectionHeaderText />,
    content: <TasksSettingsSection />,
  },
  {
    id: 'commands',
    label: <CommandsSettingsSectionHeaderText />,
    content: <CommandsSettingsSection />,
  },
];

export default function SettingsDialog() {
  const { dialogOpen, setDialogOpen } = useSettingsStore();
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const renderContent = () => {
    const tab = tabs.find((tab) => tab.id === activeTab);
    if (!tab) {
      return null;
    }

    return tab.content;
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent
        className="max-h-[90%] max-w-screen-lg overflow-auto p-0 shadow-lg md:flex"
        data-test="settings--dialog"
      >
        <div className="w-full bg-gray-900 p-4 md:w-1/4" data-test="settings--dialog--sidebar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={clsx(
                `w-full rounded-lg px-4 py-2 text-left text-gray-400 hover:bg-gray-800`,
                tab.id === activeTab && 'text-white'
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="w-full p-4 md:w-3/4" data-test="settings--dialog--content">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
