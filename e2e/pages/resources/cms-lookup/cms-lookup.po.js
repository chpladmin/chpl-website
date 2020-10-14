const elements = {
    searchId: '#lookupCertificationIdButton',
    searchField: '#certIdsField',
    downloadResults: '//*[@id="main-content"]/div[2]/div/div/button',
    lookupResultsTable: '#lookupCertIdResults',
    certidLookupError: '.cert-id-lookup-error',
    lookupResultsTableRows: '//*[@id="lookupCertIdResults"]/tbody/tr',
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

    get lookupResultsTable () {
        return $(elements.lookupResultsTable);
    }

    get certidLookupErrorText () {
        return $(elements.certidLookupError);
    }

    get rowsLookupResultsTable () {
        return $$(elements.lookupResultsTableRows);
    }
}

export default CmsLookupPage;
