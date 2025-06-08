module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^app/(.*)$': '<rootDir>/src/app/$1'
  }
};
