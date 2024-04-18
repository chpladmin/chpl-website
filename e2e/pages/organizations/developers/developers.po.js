import { open as openPage } from '../../../utilities/hooks.async';
import CollectionPage from '../../collections/collection.po';

class DevelopersPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      header: 'h1=Developers',
    };
  }

  async open() {
    await openPage('#/organizations/developers');
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }
}

export default DevelopersPage;
