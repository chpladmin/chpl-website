import { open as openPage } from '../../../utilities/hooks.async';
import CollectionPage from '../collection.po';

class DecertifiedProductsPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      header: 'h1=Decertified Products',
    };
  }

  async open() {
    await openPage('#/collections/products');
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }
}

export default DecertifiedProductsPage;
