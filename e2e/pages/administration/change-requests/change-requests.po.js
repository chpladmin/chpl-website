import { open as openPage } from '../../../utilities/hooks.async';
import CollectionPage from '../../collections/collection.po';

class ChangeRequestsPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      table: 'table[aria-label="Change Requests table"]',
    };
  }

  async open() {
    await openPage('#/administration/change-requests');
    await (browser.waitUntil(async () => (await $(this.elements.searchResultsHeader)).isDisplayed()));
  }
}

export default ChangeRequestsPage;
