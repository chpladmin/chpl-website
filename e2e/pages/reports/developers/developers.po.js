import { open as openPage } from '../../../utilities/hooks.async';
import ReportsPage from '../reports.po';

class DevelopersPage extends ReportsPage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      subTitle: 'h3=Developer',
    };
    this.expectedMinimumCount = 3300;
  }

  async open() {
    await openPage('#/reports/developers');
    await (browser.waitUntil(async () => (await $(this.elements.title)).isDisplayed()));
    await (browser.waitUntil(async () => (await $(this.elements.subTitle)).isDisplayed()));
    await this.waitForLoad();
  }

  async getSubTitle() {
    return (await $(this.elements.subTitle)).getText();
  }
}

export default DevelopersPage;
