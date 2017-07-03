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

    After(function () {
        /*
        return browser.element(by.tagName('footer')).element(by.id('login-toggle')).getText().then(function (text) {
            if (text !== 'Administrator Login') {
                return browser.element(by.tagName('footer')).element(by.id('login-toggle')).click().then(function () {
                    return browser.element(by.tagName('footer')).element(by.buttonText('Log Out')).click();
                });
            }
        });
        */
    });
});

defineSupportCode(({Before}) => {
    Before(function () {
        //return browser.get('#/');
    });
});

defineSupportCode(({setDefaultTimeout}) => {
    setDefaultTimeout(10 * 1000);
});
