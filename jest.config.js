// eslint-disable-next-line no-undef
globalThis.ngJest = {
  skipNgcc: false,
  tsconfig: 'tsconfig.spec.json',
};

/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
module.exports = {
  preset: 'jest-preset-angular',
  globalSetup: 'jest-preset-angular/global-setup',
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  moduleNameMapper: {
    "@azerafati/ngx-scroll-drag": "<rootDir>/projects/ngx-scroll-drag/src/lib/ngx-scroll-drag.module.ts"
  },
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
};
