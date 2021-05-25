import credentials from '../../config/credentials';

class LoginComponent {
  constructor() {
    this.elements = {
      component: '#login-component',
      loginToggle: '//*[@id="login-toggle"]',
      userName: '[name="userName"]',
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
    $(this.elements.component).$(this.elements.userName).addValue(credentials[user].email || credentials[user].username);
    $(this.elements.component).$(this.elements.password).addValue(credentials[user].password);
    $(this.elements.component).$(this.elements.login).scrollAndClick();
  }

  logOut() {
    if (!($(this.elements.logout).isDisplayed())) {
      this.toggleLoginComponent();
    }
    $(this.elements.logout).scrollAndClick();
    this.toggleLoginComponent();
  }
}

export default LoginComponent;
