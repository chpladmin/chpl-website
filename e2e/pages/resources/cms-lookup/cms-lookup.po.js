const elements = {
    searchId: '#lookupCertificationIdButton',
    searchField: '#certIdsField',
    downloadResults: '//*[@id="main-content"]/div[2]/div/div/button',
};

class CmsLookupPage {
    constructor () { }

    get searchIdButton () {
        return $(elements.searchId);
    }

    get searchField () {
        return $(elements.searchField);
    }

    get downloadResultsButton () {
        return $(elements.downloadResults);
    }
}

export default CmsLookupPage;
