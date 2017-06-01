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

    When('I change the download file select box to {stringInDoubleQuotes}', function (file) {
        return page.selectDownloadFile(file);
    });

    Then('there should be {int} Download Files', function (count) {
        var downloadSelect = page.model.downloadSelect;
        var downloadOptions = page.model.downloadOptions;
        return downloadSelect.click().then(function () {
            return (expect(downloadOptions.count()).to.eventually.equal(count));
        })
    });

    Then('there should be {int} Definition Files', function (count) {
        var definitionSelect = page.model.definitionSelenct;
        var definitionOptions = page.model.definitionOptions;
        return definitionSelect.click().then(function () {
            return (expect(definitionOptions.count()).to.eventually.equal(count));
        })
    });

    Then('I should see \'Download the CHPL\' as the page title', function () {
        var pageTitle = page.model.pageTitle;
        return (expect(pageTitle.getText()).eventually.to.equal('Download the CHPL'));
    });

    Then('the download select box should be {stringInDoubleQuotes}', function (file) {
        var activeDownloadFile = page.model.activeDownloadFile;
        return (expect(activeDownloadFile.getText()).to.eventually.equal(file));
    });

    Then('the definition select box should be {stringInDoubleQuotes}', function (file) {
        var activeDefinitionFile = page.model.activeDefinitionFile;
        return (expect(activeDefinitionFile.getText()).to.eventually.equal(file));
    });
});
