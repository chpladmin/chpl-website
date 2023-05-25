import { open as openPage } from '../../../utilities/hooks.async';
import CollectionPage from '../../collections/collection.po';

class QuestionableActivityPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      header: 'h1=Questionable Activity',
    };
  }

  async open() {
    await openPage('#/reports/questionable-activity');
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }
}

export default QuestionableActivityPage;
