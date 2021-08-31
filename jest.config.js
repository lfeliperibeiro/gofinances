module.exports = {
  preset: 'jest-expo',
  testPathIgnorePattern: ['/node_modules', '/android', '/ios', '/.idea'],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    'jest-styled-components',
  ],
};
