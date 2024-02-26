import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Dialog, DialogContent } from '@moaitime/web-ui';

import AccountSettingsSection from '../../auth/components/account-settings/AccountSettingsSection';
import AccountSettingsSectionHeaderText from '../../auth/components/account-settings/AccountSettingsSectionHeaderText';
import PrivacySettingsSection from '../../auth/components/privacy-settings/PrivacySettingsSection';
import PrivacySettingsSectionHeaderText from '../../auth/components/privacy-settings/PrivacySettingsSectionHeaderText';
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
import TeamSettingsSection from '../../teams/components/team-settings/TeamSettingsSection';
import TeamSettingsSectionHeaderText from '../../teams/components/team-settings/TeamSettingsSectionHeaderText';
import { useSettingsStore } from '../state/settingsStore';
import ChangelogSettingsSection from './changelog-settings/ChangelogSettingsSection';
import ChangelogSettingsSectionHeaderText from './changelog-settings/ChangelogSettingsSectionHeaderText';
import FeedbackSettingsSection from './feedback-settings/FeedbackSettingsSection';
import FeedbackSettingsSectionHeaderText from './feedback-settings/FeedbackSettingsSectionHeaderText';
import GeneralSettingsSection from './general-settings/GeneralSettingsSection';
import GeneralSettingsSectionHeaderText from './general-settings/GeneralSettingsSectionHeaderText';
import WidgetsSettingsSection from './widgets-settings/WidgetsSettingsSection';
import WidgetsSettingsSectionHeaderText from './widgets-settings/WidgetsSettingsSectionHeaderText';

const FIRST_ACTUAL_TAB_INDEX = 1;
const tabs = [
  {
    id: 'user-settings-heading',
    heading: 'User Settings',
  },
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
    id: 'privacy',
    label: <PrivacySettingsSectionHeaderText />,
    content: <PrivacySettingsSection />,
  },
  {
    id: 'user-settings-hr',
    horizontalRule: true,
  },
  {
    id: 'features-heading',
    heading: 'Features',
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
  {
    id: 'features-hr',
    horizontalRule: true,
  },
  {
    id: 'help-heading',
    heading: 'Help',
  },
  {
    id: 'changelog',
    label: <ChangelogSettingsSectionHeaderText />,
    content: <ChangelogSettingsSection />,
  },
  {
    id: 'feedback',
    label: <FeedbackSettingsSectionHeaderText />,
    content: <FeedbackSettingsSection />,
  },
  {
    id: 'footer',
    text: (
      <div className="text-muted-foreground mt-2 px-4 text-xs">
        MoaiTime Inc. © 2024 ·{' '}
        <Link to="/terms" target="_blank">
          Terms
        </Link>{' '}
        ·{' '}
        <Link to="/privacy" target="_blank">
          Privacy
        </Link>
      </div>
    ),
  },
];

export default function SettingsDialog() {
  const { auth } = useAuthStore();
  const { dialogOpen, setDialogOpen } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<string | undefined>();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const newIsMobileView = window.innerWidth < 768;
    if (!newIsMobileView && !activeTab) {
      setActiveTab(tabs[FIRST_ACTUAL_TAB_INDEX].id);
    }

    const onResize = () => {
      const newIsMobileView = window.innerWidth < 768;

      setIsMobileView(newIsMobileView);

      if (!newIsMobileView) {
        setActiveTab(tabs[FIRST_ACTUAL_TAB_INDEX].id);
      }
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!auth) {
    return null;
  }

  const renderContent = () => {
    const tab = tabs.find((tab) => tab.id === activeTab);
    if (!tab) {
      return null;
    }

    return (
      <div>
        <div className="flex items-center gap-2">
          {isMobileView && (
            <button onClick={() => setActiveTab(undefined)} className="p-1 text-lg font-bold">
              <ArrowLeftIcon size={24} />
            </button>
          )}
          <h4 className="text-lg font-bold">{tab.label}</h4>
        </div>
        {tab.content}
      </div>
    );
  };

  const onSidebarButtonClick = (tab: (typeof tabs)[number]) => {
    setActiveTab(tab.id);
  };

  const showSidebar = !isMobileView || !activeTab;
  const showContent = !isMobileView || (isMobileView && !!activeTab);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent
        className="max-h-full max-w-screen-lg overflow-auto p-0 shadow-lg md:flex"
        data-test="settings--dialog"
      >
        {showSidebar && (
          <div className="w-full p-4 md:w-1/4" data-test="settings--dialog--sidebar">
            {tabs.map((tab) => {
              if (tab.horizontalRule) {
                return <hr key={tab.id} className="my-4 border-gray-200 dark:border-gray-700" />;
              } else if (tab.heading) {
                return (
                  <h3 key={tab.id} className="mb-2 text-sm font-bold">
                    {tab.heading}
                  </h3>
                );
              } else if (tab.text) {
                return <div key={tab.id}>{tab.text}</div>;
              }

              return (
                <button
                  key={tab.id}
                  type="button"
                  className={clsx(
                    `text-muted-foreground w-full rounded-lg px-4 py-2 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800`,
                    tab.id === activeTab &&
                      'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
                  )}
                  onClick={() => onSidebarButtonClick(tab)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
        {showContent && (
          <div className="h-full w-full p-4 md:w-3/4" data-test="settings--dialog--content">
            <AnimatePresence>
              <motion.div
                layout="position"
                style={{
                  height: '100%',
                  width: '100%',
                  y: -100,
                }}
                animate={{ y: 0 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
