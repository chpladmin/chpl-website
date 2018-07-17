// import our entire app
import './index';

// test helpers
import 'angular-mocks';
// ... import any other helpers or test dependencies

const tests = require.context('./', true, /\.spec\.js$/)
tests.keys().forEach(tests)
