//features/components/resources/download.steps.js
var page = require('./download.page.js');
var {defineSupportCode} = require('cucumber');

defineSupportCode(({Given, When, Then}) => {

    Given('I am on the Resources-Download page', function () {
        return page.go();
    });

    When('I refresh the page', function () {
        return page.go();
    });

    Then('there should be {int} Download Files', function (count) {
        var downloadSelect = page.downloadPage.downloadSelect;
        var downloadOptions = page.downloadPage.downloadOptions;
        return downloadSelect.click().then(function () {
            return (expect(downloadOptions.count()).to.eventually.equal(count));
        })
    });

    Then('there should be {int} Definition Files', function (count) {
        var definitionOptions = page.downloadPage.definitionOptions;
        return (expect(definitionOptions.count()).to.eventually.equal(count));
    });
});
