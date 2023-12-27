import { useMediaQuery } from 'usehooks-ts';

// Tailwind breakpoints
const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1400,
};
type Breakpoint = keyof typeof breakpoints;

export const useBreakpoint = (breakpoint: Breakpoint) => {
  const query = `(min-width: ${breakpoints[breakpoint]}px)`;
  return useMediaQuery(query);
};
