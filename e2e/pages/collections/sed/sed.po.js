import CollectionsPage from '../collections.po';

const elements = {
  sedDetailsDownload: '//*[text()=" Download All SED Details"]',
};

class SedPage extends CollectionsPage {
  constructor() {
    super();
  }

  get sedDetailsDownloadButton() {
    return $(elements.sedDetailsDownload);
  }
}

export default SedPage;
