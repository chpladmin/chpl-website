import { open as openPage } from '../../../utilities/hooks';
import CollectionPage from '../collection.po';

class CorrectiveActionPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      header: 'h1=Products: Corrective Action Status',
    };
  }

  async open() {
    await openPage('#/collections/corrective-action');
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }
}

export default CorrectiveActionPage;
