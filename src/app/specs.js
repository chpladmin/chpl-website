// import our entire app
import './index';

// test helpers
import 'angular-mocks';
// ... import any other helpers or test dependencies

const testContext = require('.', true, /\.spec\.js$/);
testContext.keys().forEach(testContext);
