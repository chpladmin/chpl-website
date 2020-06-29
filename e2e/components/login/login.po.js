const loginElements = {
    loginButton: '#login-toggle',
    userName: '[name="username"]',
}

class LoginComponent {

    get toggleLoginComponent () {
        return $(loginElements.loginButton);
    }

    get usernameInput () {
        return $(loginElements.userName);
    }

    openLoginComponent () {
        this.toggleLoginComponent.click();
        return this;
    }
}

module.exports = new LoginComponent();
