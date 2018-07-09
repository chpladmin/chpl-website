// import our entire app
import './index';

// test helpers
import 'angular-mocks';
// ... import any other helpers or test dependencies

const testsContext = require.context('./', true, /spec$/)
testsContext.keys().forEach(testsContext)
