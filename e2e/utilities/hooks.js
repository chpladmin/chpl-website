class Hooks {
    constructor () { }

    open (path) {
        browser.maximizeWindow();
        browser.setWindowSize(1600, 1024);
        browser.url(path);
    }
}

export default Hooks;
