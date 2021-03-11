const downloadElements = {
  downloadListing: '.resources-download__listings',
  complianceActivityBullet: '.resources-download__compliance',
  download: '#downloadSelect',
  definitionFile: '#downloadChplDefinitionLink',
  dataFile: '#downloadChplLink',
};

class DownloadPage {
  constructor () { }

  get downloadListingText () {
    return $(downloadElements.downloadListing);
  }

  get complianceActivityText () {
    return $(downloadElements.complianceActivityBullet);
  }

  get downloadDropdown () {
    return $(downloadElements.download);
  }

  get definitionFile () {
    return $(downloadElements.definitionFile);
  }

  get dataFile () {
    return $(downloadElements.dataFile);
  }

}

export default DownloadPage;
