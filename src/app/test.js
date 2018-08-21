
const testContext = require.context('./services', true, /\.spec\.js/);
testContext.keys().forEach(testContext);
