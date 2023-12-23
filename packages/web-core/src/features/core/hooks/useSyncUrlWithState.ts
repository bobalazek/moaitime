import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

import { useSettingsStore } from '../../settings/state/settingsStore';
import { useTasksStore } from '../../tasks/state/tasksStore';

export const useSyncUrlWithState = () => {
  // TODO: remove once we implement all with the router

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [targetPathname, setTargetPathname] = useState(pathname);

  const { popoverOpen: tasksGetter } = useTasksStore();
  const { dialogOpen: settingsGetter } = useSettingsStore();
  const { setPopoverOpen: tasksSetter } = useTasksStore();
  const { setDialogOpen: settingsSetter } = useSettingsStore();

  // Paths
  const paths = useMemo(
    () => ({
      '/tasks': {
        getter: tasksGetter,
        setter: tasksSetter,
      },
      '/settings': {
        getter: settingsGetter,
        setter: settingsSetter,
      },
    }),
    // Setters do no change, so no point to add them to the deps array
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tasksGetter, settingsGetter]
  );

  const debouncedNavigate = useDebouncedCallback((targetPathname) => {
    navigate(targetPathname);
  }, 100);

  const updatePathStates = useCallback(
    (newPath: string) => {
      Object.entries(paths).forEach(([key, value]) => {
        value.setter(key === newPath);
      });
    },
    [paths]
  );

  useEffect(() => {
    updatePathStates(pathname);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (targetPathname && targetPathname !== pathname) {
      debouncedNavigate(targetPathname);
    }
  }, [debouncedNavigate, targetPathname, pathname]);

  useEffect(() => {
    for (const [key, value] of Object.entries(paths)) {
      if (!value.getter) {
        continue;
      }

      setTargetPathname(key);
      return;
    }

    setTargetPathname('/');
  }, [setTargetPathname, paths, tasksGetter, settingsGetter]);
};
