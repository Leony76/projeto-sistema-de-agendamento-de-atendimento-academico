const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  moduleNameMapper: {
    '^@backend/(.*)$' : '<rootDir>/src/$1',
    '^@shared/(.*)$'  : '<rootDir>/../shared/$1',
  },

  clearMocks: true,
};

export default config;