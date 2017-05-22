//features/components/resources/downloadSteps.js
var page = require('./download.page.js');
var {defineSupportCode} = require('cucumber');

defineSupportCode(({Given, When, Then}) => {

    Given('I am on the Resources-Download page', function () {
        return page.go();
    });

    Then('I should see \'Download the CHPL\' as the page title', function () {
        var pageTitle = page.downloadPage.pageTitle;
        return (expect(pageTitle.getText()).eventually.to.equal('Download the CHPL'));
    });

    Then('There should be {int} Download Files', function (count) {
        var downloadOptions = page.downloadPage.downloadOptions;
        return (expect(downloadOptions.count()).to.eventually.equal(count));
    });

    Then('There should be {int} Definition Files', function (count) {
        var definitionOptions = page.downloadPage.definitionOptions;
        return (expect(definitionOptions.count()).to.eventually.equal(count));
    });
});
