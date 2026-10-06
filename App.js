import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useColorScheme} from 'react-native';
import HomeScreen from './src/screens/home';
import InvoiceScreen from './src/screens/invoiceScreen';
import {PaperProvider} from 'react-native-paper';
import {appThemes} from './src/theme/theme';

const Stack = createNativeStackNavigator();
function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? appThemes.dark : appThemes.light;
  const navigationThemeBase =
    colorScheme === 'dark' ? NavigationDarkTheme : NavigationLightTheme;
  const navigationTheme = {
    ...navigationThemeBase,
    colors: {
      ...navigationThemeBase.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.outline,
    },
  };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="InvoiceScreen" component={InvoiceScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
