import credentials from '../../config/credentials.js';

const loginElements = {
    loginButton: '//*[@id="login-toggle"]',
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
    }

    loginAsACB () {
        if (!this.usernameInput.isDisplayed()) {
            this.openLoginComponent();
        }
        this.usernameInput.addValue(credentials.usernameACB);
        this.passwordInput.addValue(credentials.passwordACB);
        this.loginButton.click();
    }

    loginAsAdmin () {
        if (!this.usernameInput.isDisplayed()) {
            this.openLoginComponent();
        }
        this.usernameInput.addValue(credentials.usernameAdmin);
        this.passwordInput.addValue(credentials.passwordAdmin);
        this.loginButton.click();
    }

    logOut () {
        this.logoutButton.waitForDisplayed();
        this.logoutButton.waitAndClick();
    }
}

export default LoginComponent;
