import clsx from 'clsx';
import { useState } from 'react';

import { Dialog, DialogContent } from '@moaitime/web-ui';

import AccountSettingsSection from '../../auth/components/account-settings/AccountSettingsSection';
import AccountSettingsSectionHeaderText from '../../auth/components/account-settings/AccountSettingsSectionHeaderText';
import TeamSettingsSection from '../../auth/components/team-settings/TeamSettingsSection';
import TeamSettingsSectionHeaderText from '../../auth/components/team-settings/TeamSettingsSectionHeaderText';
import { useAuthStore } from '../../auth/state/authStore';
import CalendarSettingsSection from '../../calendar/components/calendar-settings/CalendarSettingsSection';
import CalendarSettingsSectionHeaderText from '../../calendar/components/calendar-settings/CalendarSettingsSectionHeaderText';
import FocusSettingsSection from '../../focus/components/focus-settings/FocusSettingsSection';
import FocusSettingsSectionHeaderText from '../../focus/components/focus-settings/FocusSettingsSectionHeaderText';
import MoodSettingsSection from '../../mood/components/mood-settings/MoodSettingsSection';
import MoodSettingsSectionHeaderText from '../../mood/components/mood-settings/MoodSettingsSectionHeaderText';
import NotesSettingsSection from '../../notes/components/notes-settings/NotesSettingsSection';
import NotesSettingsSectionHeaderText from '../../notes/components/notes-settings/NotesSettingsSectionHeaderText';
import TasksSettingsSection from '../../tasks/components/tasks-settings/TasksSettingsSection';
import TasksSettingsSectionHeaderText from '../../tasks/components/tasks-settings/TasksSettingsSectionHeaderText';
import { useSettingsStore } from '../state/settingsStore';
import GeneralSettingsSection from './general-settings/GeneralSettingsSection';
import GeneralSettingsSectionHeaderText from './general-settings/GeneralSettingsSectionHeaderText';
import WidgetsSettingsSection from './widgets-settings/WidgetsSettingsSection';
import WidgetsSettingsSectionHeaderText from './widgets-settings/WidgetsSettingsSectionHeaderText';

const tabs = [
  {
    id: 'general',
    label: <GeneralSettingsSectionHeaderText />,
    content: <GeneralSettingsSection />,
  },
  {
    id: 'account',
    label: <AccountSettingsSectionHeaderText />,
    content: <AccountSettingsSection />,
  },
  {
    id: 'team',
    label: <TeamSettingsSectionHeaderText />,
    content: <TeamSettingsSection />,
  },
  {
    id: 'calendar',
    label: <CalendarSettingsSectionHeaderText />,
    content: <CalendarSettingsSection />,
  },
  {
    id: 'tasks',
    label: <TasksSettingsSectionHeaderText />,
    content: <TasksSettingsSection />,
  },
  {
    id: 'notes',
    label: <NotesSettingsSectionHeaderText />,
    content: <NotesSettingsSection />,
  },
  {
    id: 'mood',
    label: <MoodSettingsSectionHeaderText />,
    content: <MoodSettingsSection />,
  },
  {
    id: 'focus',
    label: <FocusSettingsSectionHeaderText />,
    content: <FocusSettingsSection />,
  },
  {
    id: 'widgets',
    label: <WidgetsSettingsSectionHeaderText />,
    content: <WidgetsSettingsSection />,
  },
];

export default function SettingsDialog() {
  const { auth } = useAuthStore();
  const { dialogOpen, setDialogOpen } = useSettingsStore();
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  if (!auth) {
    return null;
  }

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
        <div className="w-full p-4 md:w-1/4" data-test="settings--dialog--sidebar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={clsx(
                `w-full rounded-lg px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800`,
                tab.id === activeTab && 'font-extrabold dark:text-white'
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
