const downloadElements = {
    productsFile: '//*[@id="main-content"]/div[2]/div[1]/ul/li[1]/ul/li[1]',
    summaryFile: '//*[@id="main-content"]/div[2]/div[1]/ul/li[1]/ul/li[2]',
    complianceActivityBullet: '//*[@id="main-content"]/div[2]/div[1]/ul/li[2]',
};

class DownloadPage {
    constructor () { }

    get productsFileText () {
        return $(downloadElements.productsFile);
    }

    get summaryFileText () {
        return $(downloadElements.summaryFile);
    }

    get complianceActivityBullet () {
        return $(downloadElements.complianceActivityBullet);
    }

}

export default DownloadPage;
