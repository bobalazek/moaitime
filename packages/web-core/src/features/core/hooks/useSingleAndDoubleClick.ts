import { useEffect, useState } from 'react';

export const useSingleAndDoubleClick = (
  actionSimpleClick: () => void,
  actionDoubleClick: () => void,
  delay = 200
) => {
  const [click, setClick] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (click === 1) {
        actionSimpleClick();
      }

      setClick(0);
    }, delay);

    if (click === 2) {
      actionDoubleClick();
    }

    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [click]);

  return () => setClick((prev) => prev + 1);
};
