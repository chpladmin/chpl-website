const searchpageElements = {
    chplResource: '#resource-toggle',
    overview: '=Overview',
    compareWidget: '#compare-widget-toggle',
    browseAll: '//button[text()=" Browse all"]',
    searchListing: '#searchField'
}

class SearchPage {
    constructor () { }

    get chplResourceButton () {
        return $(searchpageElements.chplResource);
    }

    get overviewPageButton () {
        return $(searchpageElements.overview);
    }

    get compareWidget () {
        return $(searchpageElements.compareWidget);
    }

    get browseAllButton () {
        return $(searchpageElements.browseAll);
    }

    get searchListing () {
        return $(searchpageElements.searchListing);
    }

    compareButton (listingid) {
        return $('#toggle-compare-' + listingid);
    }

    addListingToCompare (listingid) {
        this.compareButton(listingid).scrollIntoView();
        this.compareButton(listingid).click();
    }

    gotoResourcePage () {
        this.chplResourceButton.click();
        this.overviewPageButton.click();
        return this;
    }

    searchForListing (chplId) {
        this.searchListing.clearValue();
        this.searchListing.addValue(chplId);
        return this;
    }
}

export default SearchPage;
