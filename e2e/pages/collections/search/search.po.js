import { open as openPage } from '../../../utilities/hooks';
import CollectionPage from '../collection.po';

class SearchPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      header: 'h1=CHPL Listings',
    };
  }

  async bypassLandingPage() {
    await (
      await $(this.elements.filterSearchTermGo)
    ).click();
  }

  async open() {
    await openPage('#/search');
    await this.bypassLandingPage();
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }
}

export default SearchPage;
