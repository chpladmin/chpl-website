const searchpageElements = {
    chplResource: '#resource-toggle',
    overview: '=Overview',
    compareWidget: '#compare-widget-toggle',
    browseAll: '//button[text()=" Browse all"]',
    searchListing: '#searchField',
    apiInfo: '//div/a[text()="API Info for 2015 Ed. Products"]',
    sedInfo: '//div/a[text()="SED Info for 2015 Ed. Products"]',
    correctiveAction: '//div/a[text()="Products: Corrective Action"]',
    decertifiedProducts: '//div/a[text()="Decertified Products"]',
    inactiveCertificates: '//div/a[text()="Inactive Certificates"]',
    bannedDevelopers: '//div/a[text()="Banned Developers"]',
    charts: '//div/a[text()="Charts"]',
};

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

    get apiInfoButton () {
        return $(searchpageElements.apiInfo);
    }

    get sedInfoButton () {
        return $(searchpageElements.sedInfo);
    }

    get correctiveActionButton () {
        return $(searchpageElements.correctiveAction);
    }

    get decertifiedProductsButton () {
        return $(searchpageElements.decertifiedProducts);
    }

    get inactiveCertificatesButton () {
        return $(searchpageElements.inactiveCertificates);
    }

    get bannedDevelopersButton () {
        return $(searchpageElements.bannedDevelopers);
    }

    get chartsButton () {
        return $(searchpageElements.charts);
    }

    gotoResourcePage () {
        this.chplResourceButton.click();
        this.overviewPageButton.click();
    }

    searchForListing (chplId) {
        this.searchListing.clearValue();
        this.searchListing.addValue(chplId);
    }

    listingTableRowCount () {
        return $$('//table/tbody/tr').length;
    }

    getColumnText (rowNumber, columnNumber){
        return $('//table/tbody/tr[' + rowNumber +']/td[' + columnNumber +']').getText();
    }
}

export default SearchPage;
