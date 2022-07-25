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

  isLoggedIn() {
    return !(/Administrator Login/i.test(this.getLoggedInUserName()));
  }

  getLoggedInUserName() {
    return $(this.elements.loginToggle).getText();
  }

  toggleLoginComponent() {
    $(this.elements.loginToggle).click();
  }

  logIn(user) {
    let un;
    let pw;
    let btn;
    if (!($(this.elements.component).isDisplayed())) {
      if ($(this.elements.userName).isDisplayed()) {
        un = $(this.elements.userName);
        pw = $(this.elements.password);
        btn = $(this.elements.login);
      } else {
        this.toggleLoginComponent();
        un = $(this.elements.component).$(this.elements.userName);
        pw = $(this.elements.component).$(this.elements.password);
        btn = $(this.elements.component).$(this.elements.login);
      }
    }
    un.addValue(credentials[user].email || credentials[user].username);
    pw.addValue(credentials[user].password);
    btn.click();
    browser.waitUntil(() => this.isLoggedIn());
    browser.keys('Escape');
    browser.waitUntil(() => !($(this.elements.component).isDisplayed()));
  }

  logOut() {
    if (!this.isLoggedIn()) { return; }
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
