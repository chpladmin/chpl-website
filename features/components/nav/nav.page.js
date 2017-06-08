'use strict';
module.exports = {
    // page definition
    model: {
        adminNavItems: element(by.tagName('footer')).element(by.id('admin')).all(by.tagName('li')),
        footerLoginButton: element(by.tagName('footer')).element(by.buttonText('Log In')),
        footerLogoutButton: element(by.tagName('footer')).element(by.buttonText('Log Out')),
        footerPasswordField: element(by.tagName('footer')).element(by.id('password')),
        footerToggleButton: element(by.tagName('footer')).element(by.id('login-toggle')),
        footerUsernameField: element(by.tagName('footer')).element(by.id('username'))
    },

    //page methods
    go: function () {
        return browser.get('#/resources/overview');
    },

    login: function (username, password) {
        var page = this;
        return page.logout().then(function () {
            return page.toggleAdminNav().then(function () {
            page.model.footerUsernameField.sendKeys(username);
            page.model.footerPasswordField.sendKeys(password);
            return page.model.footerLoginButton.click().then(function () {
                return page.toggleAdminNav();
            });
            });
        });
    },

    logout: function () {
        var page = this;
        return this.model.footerToggleButton.getText().then(function (text) {
            if (text !== 'Administrator Login') {
                return page.toggleAdminNav().then(function () {
                    return page.model.footerLogoutButton.click().then(function () {
                        return page.toggleAdminNav();
                    })
                })
            }
        });
    },

    toggleAdminNav: function () {
        return this.model.footerToggleButton.click();
    }
};
