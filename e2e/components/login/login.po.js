import credentials from '../../config/credentials';

class LoginComponent {
  constructor() {
    this.elements = {
      component: '#login-component',
      loginToggle: '//*[@id="login-toggle"]',
      userName: '[name="userName"]',
      username: '[name="username"]',
      password: '[name="password"]',
      login: 'button=Log In',
      logout: '//button[text()="Log Out"]',
    };
  }

  getLoggedInUserName() {
    return $(this.elements.loginToggle).getText();
  }

  waitToBeLoggedIn() {
    if (!($(this.elements.logout).isDisplayed())) {
      this.toggleLoginComponent();
    }
    $(this.elements.logout).waitForDisplayed();
  }

  toggleLoginComponent() {
    $(this.elements.loginToggle).scrollAndClick();
  }

  logIn(user) {
    let un;
    let pw;
    let btn;
    if ($(this.elements.component).isDisplayed()) {
      un = $(this.elements.component).$(this.elements.userName);
      pw = $(this.elements.component).$(this.elements.password);
      btn = $(this.elements.component).$(this.elements.login);
    } else {
      this.toggleLoginComponent();
      un = $(this.elements.username);
      pw = $(this.elements.password);
      btn = $(this.elements.login);
    }
    un.addValue(credentials[user].email || credentials[user].username);
    pw.addValue(credentials[user].password);
    btn.scrollAndClick();
    if (!($(this.elements.component).isDisplayed())) {
      this.toggleLoginComponent();
    }
  }

  logOut() {
    if (!($(this.elements.logout).isDisplayed())) {
      this.toggleLoginComponent();
    }
    $(this.elements.logout).scrollAndClick();
    browser.waitUntil(() => this.getLoggedInUserName() === 'Administrator Login');
    this.toggleLoginComponent();
  }
}

export default LoginComponent;
