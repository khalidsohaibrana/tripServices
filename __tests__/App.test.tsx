/**
 * @format
 */

import 'react-native';
import React from 'react';
import {it, jest} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('react-native-html-to-pdf', () => ({
  convert: jest.fn(),
}));

jest.mock('react-native-print', () => ({
  print: jest.fn(),
}));

jest.mock('react-native-share', () => ({
  open: jest.fn(),
}));

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

jest.mock('@react-navigation/native', () => ({
  DarkTheme: {
    dark: true,
    colors: {},
  },
  DefaultTheme: {
    dark: false,
    colors: {},
  },
  NavigationContainer: ({children}) => children,
  useNavigation: () => ({navigate: jest.fn()}),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({children}) => children,
    Screen: () => null,
  }),
}));

import App from '../App';

it('renders correctly', () => {
  renderer.create(<App />);
});
