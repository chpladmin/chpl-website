import BasePage from '../../utilities/basePage.js';

const loginElements = {
    loginButton: '#login-toggle',
    userName: '[name="username"]',
}

class LoginComponent extends BasePage {

    get toggleLoginComponent () {
        return $(loginElements.loginButton);
    }

    get usernameInput () {
        return $(loginElements.userName);
    }

    gotoLoginComponent () {
        this.toggleLoginComponent.click();
        return this;
    }
}

module.exports = new LoginComponent();
