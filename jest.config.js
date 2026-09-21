module.exports = {
  testEnvironment: 'jsdom',

  // Tests must be named *.test.jsx, never *.test.js: the `require.context`
  // sweeps in src/app/pages/*/index.js match /.*\.js$/ and would pull a .test.js
  // file into the application bundle.
  testMatch: ['<rootDir>/src/**/*.test.jsx'],

  // Mirrors webpack's `resolve.modules: ['src/app', 'node_modules']` so bare
  // imports like `components/util` and `shared/contexts` resolve in tests.
  modulePaths: ['<rootDir>/src/app'],
  moduleFileExtensions: ['js', 'jsx', 'json'],

  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],

  // webpack resolves these through style-loader / url-loader / file-loader;
  // under jest they only need to not explode.
  moduleNameMapper: {
    '\\.(css|scss|sass)$': '<rootDir>/test/stubs/style.js',
    '\\.(png|jpe?g|gif|svg|ico|woff2?|ttf|eot)$': '<rootDir>/test/stubs/file.js',
  },

  // Deliberately not inheriting .babelrc: it targets browsers and injects
  // core-js 2 polyfills via `useBuiltIns: usage` (plus `debug: true`), none of
  // which we want when running under the current node.
  transform: {
    '^.+\\.jsx?$': ['babel-jest', {
      babelrc: false,
      configFile: false,
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-react',
      ],
    }],
  },
};
