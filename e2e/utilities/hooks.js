class Hooks {
    constructor () { }

    open (path) {
        browser.maximizeWindow();
        browser.url(path);
    }
}

export default Hooks;
