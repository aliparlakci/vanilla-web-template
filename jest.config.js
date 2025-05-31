export default {
  testEnvironment: 'jsdom',
  transform: {},
  moduleNameMapper: {
    '^/(.*)$': '<rootDir>/$1'
  },
  // Mock localStorage for tests
  setupFiles: ['./tests/setup.js']
};
