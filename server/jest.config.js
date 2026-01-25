/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm', // Use the ESM preset
  testEnvironment: 'node',
  rootDir: './src',
  extensionsToTreatAsEsm: ['.ts'],
  setupFiles: ["../jest.setup.js"],
  moduleNameMapper: {
    // This handles the .js extension in imports which NodeNext requires
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    // Use ts-jest with ESM support
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};