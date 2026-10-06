import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import HomeScreen from './src/screens/home';
import InvoiceScreen from './src/screens/invoiceScreen';
import {PaperProvider} from 'react-native-paper';
import {darkTheme, lightTheme} from './src/theme/theme';

const Stack = createNativeStackNavigator();
function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <PaperProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="InvoiceScreen" component={InvoiceScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
