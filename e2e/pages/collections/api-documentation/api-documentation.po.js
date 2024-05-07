import { open as openPage } from '../../../utilities/hooks';
import CollectionPage from '../collection.po';

class ApiDocumentationPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      header: 'h1=API Information',
      downloadApiDocumentation: 'a=Download API Documentation Dataset',
    };
  }

  async open() {
    await openPage('#/collections/api-documentation');
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }

  async getDownloadApiDocumentation() {
    return $(this.elements.downloadApiDocumentation);
  }
}

export default ApiDocumentationPage;
