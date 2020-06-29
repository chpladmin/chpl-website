const config = require('../config/mainConfig');

class Hooks {
    open (path) {
        browser.maximizeWindow();
        browser.url(config.baseUrl + path);
    }
}

module.exports = new Hooks();
