class Hooks {
    constructor () { }

    open (path) {
        browser.maximizeWindow();
        browser.setWindowSize(1600, 1024);
        browser.url(path);
    }

    waitForSpinnerToDisappear () {
        browser.waitUntil( () => !$('#loading-bar-spinner').isDisplayed());
    }
}

export default Hooks;
