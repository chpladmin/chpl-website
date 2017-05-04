'use strict';
module.exports = {
    // page definition
    downloadPage: {
        pageTitle: element(by.tagName('h1')),
        downloadSelect: element(by.id('downloadOption')),
        downloadOptions: element(by.id('downloadOption')).all(by.tagName('option')),
        definitionSelect: element(by.id('definitionSelect')),
        defintionOptions: element(by.id('definitionSelect')).all(by.tagName('option')),
    },

    //page methods
    go: function () {
        browser.get('#/resources/download');
    }
};
