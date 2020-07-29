const homepageElements = {
    developersSelect: '#developer-select',
    developersButton: '#developer-button',
}

class DevelopersPage {
    constructor () { }

    get developersSelect () {
        return $(homepageElements.developersSelect);
    }

    get developersButton () {
        return $(homepageElements.developersButton);
    }

    selectDeveloper (developerName) {
        this.developersSelect.selectByVisibleText(developerName);
        this.developersButton.click();
        return this;
    }
}

export default DevelopersPage;
