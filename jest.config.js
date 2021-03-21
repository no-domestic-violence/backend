module.exports = {
  verbose: true,
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: ['./node_modules/', 'build/'],
  collectCoverageFrom: ['src/*.{js}', 'src/**/*.{js,jsx}'],
};
