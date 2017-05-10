'use strict';
module.exports = {
    // page definition
    model: {
        usernameField: element(by.css('.jumbotron')).element(by.id('username')),
        passwordField: element(by.css('.jumbotron')).element(by.id('password')),
        loginButton: element(by.css('.jumbotron')).element(by.buttonText('Log In'))
                                                          /*
        pageTitle: element(by.tagName('h1')),
        downloadSelect: element(by.id('downloadSelect')),
        downloadOptions: element(by.id('downloadSelect')).all(by.tagName('option')),
        activeDownloadFile: element(by.id('downloadSelect')).element(by.css('option:checked')),
        definitionSelect: element(by.id('definitionSelect')),
        definitionOptions: element(by.id('definitionSelect')).all(by.tagName('option')),
        activeDefinitionFile: element(by.id('definitionSelect')).element(by.css('option:checked'))
        */
    },

    //page methods
    go: function () {
        browser.get('#/admin');
    },

    getTitle: function () {
        return browser.getTitle();
    },

    login: function (username, password) {
        this.model.usernameField.sendKeys(username);
        this.model.passwordField.sendKeys(password);
        this.model.loginButton.click();
    }
};
