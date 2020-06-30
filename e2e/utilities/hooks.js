const config = require('../config/mainConfig');

class Hooks {
    constructor () { }

    open (path) {
        browser.maximizeWindow();
        browser.url(config.baseUrl + path);
    }
}

export default Hooks;
