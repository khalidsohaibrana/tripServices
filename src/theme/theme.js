import {MD3LightTheme, MD3DarkTheme} from 'react-native-paper';
import {colors} from './colors';

const buildTheme = (baseTheme, palette) => ({
  ...baseTheme,
  roundness: 5,
  colors: {
    ...baseTheme.colors,
    primary: palette.primary,
    secondary: palette.secondary,
    background: palette.background,
    surface: palette.surface,
    surfaceVariant: palette.surfaceVariant,
    logoSurface: palette.logoSurface,
    outline: palette.border,
    error: palette.error,
    accent: palette.accent,
    text: palette.text,
    textMuted: palette.textMuted,
    onPrimary: palette.onPrimary,
    subtleBackground: palette.subtleBackground,
    onSurface: palette.text,
    onBackground: palette.text,
  },
});

export const lightTheme = buildTheme(MD3LightTheme, colors);
export const darkTheme = buildTheme(MD3DarkTheme, colors.dark);

export const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};
