var {defineSupportCode} = require('cucumber');

defineSupportCode(({After}) => {
    // Returning the promise
    After(function (scenarioResult) {
        var world = this;
        if (scenarioResult.isFailed()) {
            return browser.takeScreenshot().then(function (png) {
                var decodedImage = new Buffer(png, 'base64');
                return world.attach(decodedImage, 'image/png');
            });
        }
    });
});

defineSupportCode(({Before}) => {
    Before(function () {
        // do setup stuff here
    });
});

defineSupportCode(({setDefaultTimeout}) => {
    setDefaultTimeout(10 * 1000);
});
