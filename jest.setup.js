/* eslint-env jest */
jest.mock('./src/data/nativeDatabase', () => ({
  openRepository: jest.fn(() => {
    throw new Error('Native SQLite is unavailable in Jest');
  }),
}));
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);

jest.mock('@notifee/react-native', () =>
  require('@notifee/react-native/jest-mock'),
);
