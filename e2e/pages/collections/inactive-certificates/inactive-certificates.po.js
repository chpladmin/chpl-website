import { open as openPage } from '../../../utilities/hooks';
import CollectionPage from '../collection.po';

class InactiveCertificatesPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      header: 'h1=Inactive Certificates',
    };
  }

  async open() {
    await openPage('#/collections/inactive');
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }
}

export default InactiveCertificatesPage;
