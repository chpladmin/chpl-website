import { open as openPage } from '../../../utilities/hooks.async';
import CollectionPage from '../collection.po';

class SedPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      header: 'h1=SED Information for 2015 Edition Products',
      downloadSedDetails: '#download-sed-details',
    };
  }

  async open() {
    await openPage('#/collections/sed');
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }

  async getDownloadSedDetails() {
    return $(this.elements.downloadSedDetails);
  }
}

export default SedPage;
