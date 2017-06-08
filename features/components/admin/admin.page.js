'use strict';
module.exports = {
    // page definition
    model: {
        adminNavItems: element(by.tagName('footer')).element(by.css('navbar-right')).element(by.css('dropdown-menu')).all(by.tagName('li')),
        footerLoginButton: element(by.tagName('footer')).element(by.buttonText('Log In')),
        footerPasswordField: element(by.tagName('footer')).element(by.id('password')),
        footerToggleButton: element(by.tagName('footer')).element(by.id('login-toggle')),
        footerUsernameField: element(by.tagName('footer')).element(by.id('username')),
        loginButton: element(by.css('.jumbotron')).element(by.buttonText('Log In')),
        passwordField: element(by.css('.jumbotron')).element(by.id('password')),
        usernameField: element(by.css('.jumbotron')).element(by.id('username'))
    },

    //page methods
    go: function () {
        return browser.get('#/admin');
    },

    login: function (username, password) {
        return this.openAdminNav()
            .then(this.model.footerUsernameField.sendKeys(username))
            .then(this.model.footerPasswordField.sendKeys(password))
            .then(this.model.footerLoginButton.click());
    },

    openAdminNav: function () {
        return this.model.footerToggleButton.click();
    }
};
