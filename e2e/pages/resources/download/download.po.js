const downloadElements = {
    downloadListing: '.resources-download__listings',
    complianceActivityBullet: '.resources-download__compliance',
};

class DownloadPage {
    constructor () { }

    get downloadListingText () {
        return $(downloadElements.downloadListing);
    }

    get complianceActivityText () {
        return $(downloadElements.complianceActivityBullet);
    }

}

export default DownloadPage;
