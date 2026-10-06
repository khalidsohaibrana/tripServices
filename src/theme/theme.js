// theme/theme.js
import {MD3LightTheme, MD3DarkTheme} from 'react-native-paper';
import {colors} from './colors'; // Import colors from colors.js

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    accent: colors.accent,
    text: colors.text,
    subtleBackground: colors.subtleBackground,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.dark.primary,
    secondary: colors.dark.secondary,
    background: colors.dark.background,
    accent: colors.dark.accent,
    text: colors.dark.text,
    subtleBackground: colors.dark.subtleBackground,
  },
};
