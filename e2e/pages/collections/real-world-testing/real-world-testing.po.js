import { open as openPage } from '../../../utilities/hooks.async';
import CollectionPage from '../collection.po';

class RealWorldTestingPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      header: 'h1=Real World Testing',
      downloadRealWorldTesting: '#download-real-world-testing',
    };
  }

  async open() {
    await openPage('#/collections/real-world-testing');
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }

  async getDownloadRealWorldTesting() {
    return $(this.elements.downloadRealWorldTesting);
  }
}

export default RealWorldTestingPage;
