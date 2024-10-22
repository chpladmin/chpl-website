import credentials from '../config/credentials';

const { $, browser } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

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

  async isLoggedIn() {
    return !(/Administrator Login/i.test(await this.getLoggedInUserName()));
  }

  async getLoggedInUserName() {
    return (await $(this.elements.loginToggle)).getText();
  }

  async toggleLoginComponent() {
    await (await $(this.elements.loginToggle)).click();
  }

  async logIn(user) {
    let un;
    let pw;
    let btn;
    if (!(await (await $(this.elements.component)).isDisplayed())) {
      if (await (await $(this.elements.userName)).isDisplayed()) {
        un = await $(this.elements.userName);
        pw = await $(this.elements.password);
        btn = await $(this.elements.login);
      } else {
        await this.toggleLoginComponent();
        un = await (await $(this.elements.component)).$(this.elements.userName);
        pw = await (await $(this.elements.component)).$(this.elements.password);
        btn = await (await $(this.elements.component)).$(this.elements.login);
      }
    }
    await un.addValue(credentials[user].email || credentials[user].username);
    await pw.addValue(credentials[user].password);
    await btn.click();
    await browser.waitUntil(async () => this.isLoggedIn());
    await browser.keys('Escape');
    await browser.waitUntil(async () => !((await $(this.elements.component).isDisplayed())));
  }

  async logOut() {
    if (!(await this.isLoggedIn())) { return; }
    if (!(await (await $(this.elements.component)).isDisplayed())) {
      await this.toggleLoginComponent();
    }
    await (await (await $(this.elements.component)).$(this.elements.logout)).click();
    await (await $(this.elements.login)).waitForDisplayed();
    await browser.keys('Escape');
    await browser.waitUntil(async () => !((await (await $(this.elements.component)).isDisplayed())));
  }
}

export default LoginComponent;
