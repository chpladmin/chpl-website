const loginElements = {
    loginButton: '#login-toggle',
    userName: '[name="username"]',
    password: '[name="password"]',
    login: 'button=Log In',
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

    get loginBtn () {
        return $(loginElements.login);
    }

    openLoginComponent () {
        this.toggleLoginComponent.click();
        return this;
    }

    loginAsACB () {
        this.openLoginComponent();
        this.usernameInput.addValue(process.env.USERNAMEACB);
        this.passwordInput.addValue(process.env.PASSWORDACB);
        this.loginBtn.click();
        return this;
    }

    loginAsAdmin () {
        this.openLoginComponent();
        this.usernameInput.addValue(process.env.USERNAMEADMIN);
        this.passwordInput.addValue(process.env.PASSWORDADMIN);
        this.loginBtn.click();
        return this;
    }
}

export default LoginComponent;
