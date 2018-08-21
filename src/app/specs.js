// import our entire app
import './index';
import './chpl.mock';

// test helpers
import ngMock from 'angular-mocks';

const tests = require.context('./', true, /\.spec\.js/)
//const tests = require.context('./registration/components/', true, /\.spec\.js/)
tests.keys().forEach(tests)
