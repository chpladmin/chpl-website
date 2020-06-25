import BasePage from '../../utilities/BasePage.js';
const config = require('../../config/mainConfig.js');

const loginElements= {
    LoginButton: '#login-toggle',
    Username: '[name="username"]',
}

class LoginPage extends BasePage {
    open () {
        super.open(config.baseUrl);
    }

    get login () {
        return $(loginElements.LoginButton);
    }

    get username () {
        return $(loginElements.Username);
    }

    gotoLoginPage () {
        this.login.click();
        return this;
    }
}

module.exports = new LoginPage();
