import credentials from '../../config/credentials.js';

const elements = {
  component: '#login-component',
  loginToggle: '//*[@id="login-toggle"]',
  userName: '[name="userName"]',
  password: '[name="password"]',
  login: 'button=Log In',
  logout: '//button[text()="Log Out"]',
};

class LoginComponent {
  constructor () { }

  getLoggedInUserName () {
    return $(elements.loginToggle).getText();
  }

  waitForLoggedIn () {
    if (!($(elements.logout).isDisplayed())) {
      this.toggleLoginComponent();
    }
    $(elements.logout).waitForDisplayed();
  }

  toggleLoginComponent () {
    $(elements.loginToggle).scrollAndClick();
  }

  logIn (user) {
    $(elements.component).$(elements.userName).addValue(credentials[user].email || credentials[user].username);
    $(elements.component).$(elements.password).addValue(credentials[user].password);
    $(elements.component).$(elements.login).scrollAndClick();
  }

  logOut () {
    if (!($(elements.logout).isDisplayed())) {
      this.toggleLoginComponent();
    }
    $(elements.logout).scrollAndClick();
    this.toggleLoginComponent();
  }
}

export default LoginComponent;
