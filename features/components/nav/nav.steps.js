var page = require('./nav.page.js');
var {defineSupportCode} = require('cucumber');

defineSupportCode(({Given, When, Then}) => {

    Given('I am on the CHPL', function () {
        return page.go();
    });

    Given('I am not logged in', function () {
        return page.logout();
    });

    Then('the admin navigation should have {int} elements', function (navCount) {
        return page.toggleAdminNav().then(function () {
            var adminNavItems = page.model.adminNavItems;
            return expect(adminNavItems.count()).to.eventually.equal(navCount);
        });
    });

    Then('the admin navigation button text should be {stringInDoubleQuotes}', function (name) {
        return (expect(page.model.footerToggleButton.getText()).to.eventually.equal(name));
    });
});
