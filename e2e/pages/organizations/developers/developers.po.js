const elements = {
    developersSelect: '#developer-select',
    developersButton: '#developer-button',
    directReviewsHeader: 'h2=Direct Review Activities',
}

class DevelopersPage {
    constructor () { }

    get developersSelect () {
        return $(elements.developersSelect);
    }

    get developersButton () {
        return $(elements.developersButton);
    }

    get directReviewsHeader () {
        return $(elements.directReviewsHeader);
    }

    selectDeveloper (developerName) {
        this.developersSelect.selectByVisibleText(developerName);
        this.developersButton.click();
        return this;
    }
}

export default DevelopersPage;
