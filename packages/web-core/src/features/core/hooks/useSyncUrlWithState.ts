import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

import { useCalendarStore } from '../../calendar/state/calendarStore';
import { useSettingsStore } from '../../settings/state/settingsStore';
import { useTasksStore } from '../../tasks/state/tasksStore';

export const useSyncUrlWithState = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Getters and setters
  const calendarGetter = useCalendarStore().dialogOpen;
  const tasksGetter = useTasksStore().popoverOpen;
  const settingsGetter = useSettingsStore().dialogOpen;
  const calendarSetter = useCalendarStore().setDialogOpen;
  const tasksSetter = useTasksStore().setPopoverOpen;
  const settingsSetter = useSettingsStore().setDialogOpen;

  // Paths
  const paths = useMemo(
    () => ({
      '/calendar': {
        getter: calendarGetter,
        setter: calendarSetter,
      },
      '/tasks': {
        getter: tasksGetter,
        setter: tasksSetter,
      },
      '/settings': {
        getter: settingsGetter,
        setter: settingsSetter,
      },
    }),
    [calendarGetter, calendarSetter, settingsGetter, settingsSetter, tasksGetter, tasksSetter]
  );

  const debouncedNavigate = useDebouncedCallback((targetPathname) => {
    navigate(targetPathname);
  }, 100);

  // For the initial load
  useEffect(() => {
    for (const [key, value] of Object.entries(paths)) {
      value.setter(pathname === key);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When we change the state, we also want to change the URL
  useEffect(() => {
    let targetPathname = '/';

    for (const [key, value] of Object.entries(paths)) {
      console.log(key, value.getter);

      if (!value.getter) {
        continue;
      }

      targetPathname = key;
      break;
    }

    if (pathname === targetPathname) {
      return;
    }

    debouncedNavigate(targetPathname);
  }, [debouncedNavigate, pathname, paths]);
};
