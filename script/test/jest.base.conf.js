const path = require('path');

// To have consistent date time parsing both in local and CI environments we set
// the timezone of the Node process.
process.env.TZ = 'Asia/Shanghai';

module.exports = {
  verbose: true,
  rootDir: path.resolve(__dirname, '../../'),
  testURL: 'http://localhost/',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'vue', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^tdesign-vue/lib/(.*)$': '<rootDir>/src/$1',
    '^tdesign-vue/es': '<rootDir>/src',
    '^tdesign-vue$': '<rootDir>/src/index.ts',
    '^tdesign-vue(.*)': '<rootDir>/src/$1',
    '^vue$': '<rootDir>/node_modules/vue/dist/vue.js',
    '^tdesign-icons-vue$': '<rootDir>/node_modules/tdesign-icons-vue/dist/index.js',
  },
  modulePathIgnorePatterns: ['<rootDir>/test/unit/coverage/'],
  transform: {
    '.*\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
    '.*\\.tsx?$': 'ts-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  testRegex: '.*\\.test\\.js$',
  testPathIgnorePatterns: ['/node_modules/', '.history'],
  setupFiles: ['<rootDir>/script/test/setup'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
      babelConfig: true,
    },
  },
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: 'TDesign Test Report',
      },
    ],
  ],
  snapshotSerializers: ['jest-serializer-vue'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
