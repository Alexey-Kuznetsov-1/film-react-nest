module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(uuid)/)'],
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'),
  },
  setupFiles: ['<rootDir>/test.setup.ts'],
};