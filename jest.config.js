module.exports = {
  verbose: true,
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
  collectCoverage: true,
  coverageReporters: ['html', 'text-summary', 'lcovonly'],
  testPathIgnorePatterns: ['./node_modules/', 'build/'],
  collectCoverageFrom: ['<rootDir>/src/**/*.js'],
  setupFilesAfterEnv: ['<rootDir>/setupTest.js'],
};
