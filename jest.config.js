module.exports = {
  preset: '@react-native/jest-preset',
  testTimeout: 30000,
  testPathIgnorePatterns: ['/node_modules/', '/.bootstrap/'],
  modulePathIgnorePatterns: ['<rootDir>/.bootstrap/'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@notifee|react-native-safe-area-context|react-native-screens)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
