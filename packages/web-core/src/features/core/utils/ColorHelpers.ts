import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';

extend([a11yPlugin]);

export const getTextColor = (backgroundColor?: string) => {
  if (!backgroundColor) {
    return undefined;
  }

  const color = colord(backgroundColor);
  const luminance = color.luminance();
  let contrastingColor;

  if (luminance > 0.5) {
    contrastingColor = color.darken(0.5).toHex();
  } else {
    contrastingColor = color.lighten(0.5).toHex();
  }

  return contrastingColor;
};

export const getLighterBackgroundColor = (backgroundColor: string, amount: number = 0.1) => {
  return colord(backgroundColor).lighten(amount).toHex();
};

export const getDarkerBackgroundColor = (backgroundColor: string, amount: number = 0.1) => {
  return colord(backgroundColor).darken(amount).toHex();
};
