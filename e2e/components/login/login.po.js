import credentials from '../../config/credentials.js';

const loginElements = {
    loginButton: '#login-toggle',
    userName: '[name="username"]',
    password: '[name="password"]',
    login: 'button=Log In',
    logout: '//button[text()="Log Out"]',
}

class LoginComponent {
    constructor () { }

    get toggleLoginComponent () {
        return $(loginElements.loginButton);
    }

    get usernameInput () {
        return $(loginElements.userName);
    }

    get passwordInput () {
        return $(loginElements.password);
    }

    get loginButton () {
        return $(loginElements.login);
    }

    get logoutButton () {
        return $(loginElements.logout);
    }

    openLoginComponent () {
        this.toggleLoginComponent.click();
        return this;
    }

    loginAsACB () {
        this.openLoginComponent();
        if (this.usernameInput.isDisplayed()) {
            this.usernameInput.addValue(credentials.usernameACB);
        }
        else {
            this.openLoginComponent();
            this.usernameInput.addValue(credentials.usernameACB);
        }
        this.passwordInput.addValue(credentials.passwordACB);
        this.loginButton.click();
        return this;
    }

    loginAsAdmin () {
        this.openLoginComponent();
        this.usernameInput.addValue(credentials.usernameAdmin);
        this.passwordInput.addValue(credentials.passwordAdmin);
        this.loginButton.click();
        return this;
    }

    logOut () {
        this.logoutButton.waitForDisplayed();
        this.logoutButton.waitAndClick();
    }
}

export default LoginComponent;
