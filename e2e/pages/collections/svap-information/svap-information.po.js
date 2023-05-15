import { open as openPage } from '../../../utilities/hooks.async';
import CollectionPage from '../collection.po';

class SvapInformationPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      header: 'h1=SVAP Information',
      downloadSvapDocumentation: 'a=Download SVAP Summary',
    };
  }

  async open() {
    await openPage('#/collections/svap');
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }

  async getDownloadSvapDocumentation() {
    return $(this.elements.downloadSvapDocumentation);
  }
}

export default SvapInformationPage;
