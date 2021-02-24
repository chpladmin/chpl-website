import credentials from '../../config/credentials.js';

const loginElements = {
  loginButton: '//*[@id="login-toggle"]',
  userName: '[name="username"]',
  password: '[name="password"]',
  login: 'button=Log In',
  logout: '//button[text()="Log Out"]',
};

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
    this.toggleLoginComponent.scrollAndClick();
  }

  logIn (user) {
    if (!this.usernameInput.isDisplayed()) {
      this.openLoginComponent();
    }
    this.usernameInput.addValue(credentials[user].email || credentials[user].username);
    this.passwordInput.addValue(credentials[user].password);
    this.loginButton.scrollAndClick();
  }

  logInWithEmail (user) {
    this.logIn(user);
  }

  logOut () {
    if (!this.logoutButton.isDisplayed()) {
      this.openLoginComponent();
    }
    this.logoutButton.waitForDisplayed();
    this.logoutButton.scrollAndClick();
  }
}

export default LoginComponent;
