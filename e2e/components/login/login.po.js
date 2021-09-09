import credentials from '../../config/credentials';

class LoginComponent {
  constructor() {
    this.elements = {
      component: '#admin-login-form',
      loginToggle: '#login-toggle',
      userName: '#user-name',
      password: '#password',
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
    if (!($(this.elements.component).isDisplayed())) {
      this.toggleLoginComponent();
    }
    const un = $(this.elements.component).$(this.elements.userName);
    const pw = $(this.elements.component).$(this.elements.password);
    const btn = $(this.elements.component).$(this.elements.login);
    un.addValue(credentials[user].email || credentials[user].username);
    pw.addValue(credentials[user].password);
    btn.click();
    $(this.elements.logout).waitForDisplayed();
    browser.keys('Escape');
    browser.waitUntil(() => !($(this.elements.component).isDisplayed()));
  }

  logOut() {
    if (!($(this.elements.component).isDisplayed())) {
      this.toggleLoginComponent();
    }
    const btn = $(this.elements.component).$(this.elements.logout);
    btn.click();
    $(this.elements.login).waitForDisplayed();
    browser.keys('Escape');
    browser.waitUntil(() => !($(this.elements.component).isDisplayed()));
  }
}

export default LoginComponent;
