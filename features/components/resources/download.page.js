'use strict';
module.exports = {
    // page definition
    model: {
        pageTitle: element(by.tagName('h1')),
        downloadSelect: element(by.id('downloadSelect')),
        downloadOptions: element(by.id('downloadSelect')).all(by.tagName('option')),
        activeDownloadFile: element(by.id('downloadSelect')).element(by.css('option:checked')),
        definitionSelect: element(by.id('definitionSelect')),
        definitionOptions: element(by.id('definitionSelect')).all(by.tagName('option')),
        activeDefinitionFile: element(by.id('definitionSelect')).element(by.css('option:checked'))
    },

    //page methods
    go: function () {
        return browser.get('#/resources/download');
    },

    selectDownloadFile: function (name) {
        this.model.downloadSelect.element(by.cssContainingText('option', name)).click();
    }
};
