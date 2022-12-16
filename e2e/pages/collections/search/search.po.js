import { open as openPage } from '../../../utilities/hooks.async';
import CollectionPage from '../collection.po';

class SearchPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      header: 'h1=Search',
    };
  }

  async open() {
    await openPage('#/administration/search');
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }
}

export default SearchPage;
