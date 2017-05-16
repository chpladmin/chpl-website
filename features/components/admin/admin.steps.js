//features/components/admin/admin.steps.js
var page = require('./admin.page.js');
var {defineSupportCode} = require('cucumber');

defineSupportCode(({Given, When, Then}) => {

    Given('I am on the Administration page', function () {
        return page.go();
    });

    Then('the page title should be {stringInDoubleQuotes}', function (title) {
        return expect(page.getTitle()).to.eventually.equal(title);
    });

    Then('the login form should go away', function () {
        return expect(page.model.usernameField).to.be.undefined;
    });
});
