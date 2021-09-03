import credentials from '../../config/credentials';

class LoginComponent {
  constructor() {
    this.elements = {
      component: '#admin',
      loginToggle: '#login-toggle',
      userName: '[name="userName"]',
      password: '[name="password"]',
      login: 'button=Log In',
      logout: 'button=Log Out',
    };
  }

  getLoggedInUserName() {
    return $(this.elements.loginToggle).getText();
  }

  toggleLoginComponent() {
    $(this.elements.loginToggle).click();
  }

  logIn(user) {
    const un = $(this.elements.component).$(this.elements.userName);
    const pw = $(this.elements.component).$(this.elements.password);
    const btn = $(this.elements.component).$(this.elements.login);
    this.toggleLoginComponent();
    un.addValue(credentials[user].email || credentials[user].username);
    pw.addValue(credentials[user].password);
    btn.click();
    $(this.elements.logout).waitForDisplayed();
    this.toggleLoginComponent();
  }

  logOut() {
    if (!($(this.elements.logout).isDisplayed())) {
      this.toggleLoginComponent();
    }
    $(this.elements.logout).click();
    browser.waitUntil(() => this.getLoggedInUserName() === 'Administrator Login');
    this.toggleLoginComponent();
  }
}

export default LoginComponent;
