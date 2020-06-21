export default class basePage {
    open(path) {
        browser.maximizeWindow();
        browser.url(path);
    }
}
