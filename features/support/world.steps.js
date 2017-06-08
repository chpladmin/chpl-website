var {defineSupportCode} = require('cucumber');

defineSupportCode(({Given, When, Then}) => {
    Then('the browser page title should be {stringInDoubleQuotes}', function (title) {
        return expect(browser.getTitle()).to.eventually.equal(title);
    });

    Then('I should see {stringInDoubleQuotes} as the visible page title', function (title) {
        return (expect(browser.element(by.tagName('h1')).getText()).to.eventually.equal(title));
    });
});
