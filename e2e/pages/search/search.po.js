const homepageElements = {
    chplResource: '#resource-toggle',
    overview: '=Overview',
}

class SearchPage {

    get chplResourceButton () {
        return $(homepageElements.chplResource);
    }

    get overviewPageButton () {
        return $(homepageElements.overview);
    }

    gotoResourcePage () {
        this.chplResourceButton.click();
        this.overviewPageButton.click();
        return this;
    }
}

module.exports = new SearchPage();
