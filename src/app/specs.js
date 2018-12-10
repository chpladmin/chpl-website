// import our entire app
import './index';
import './chpl.mock';

// test helpers
import 'angular-mocks';

const tests = require.context('./', true, /\/(?!\.).*\.spec\.js$/)
tests.keys().forEach(tests)
