export default class BasePage {
    open (path) {
        browser.maximizeWindow();
        browser.url(path);
    }
}
