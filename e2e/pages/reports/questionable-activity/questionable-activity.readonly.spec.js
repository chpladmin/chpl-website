import LoginComponent from '../../../components/login/login.po';
import { open as openPage } from '../../../utilities/hooks';

import QuestionableActivityPage from './questionable-activity.po';

let login;
let page;

describe('the Questionable Activity page', () => {
  beforeAll(async () => {
    login = new LoginComponent();
    await openPage('#/resources/overview');
    await login.logIn('admin');
  });

  beforeEach(async () => {
    page = new QuestionableActivityPage();
    await page.open();
  });

  it('should have body text', async () => {
    await expect(await page.getBodyText()).toContain('The Questionable Activity Report offers users the ability to monitor the activities performed on specific CHPL products by ONC-Authorized Certification Bodies and assess their adherence to ONC-established rules. This feature serves as an essential transparency mechanism, allowing ONC to identify any questionable actions that may warrant further investigation. Users can filter and search this list based on their specific interests or concerns.');
  });

  it('should have table headers in a defined order', async () => {
    const expectedHeaders = ['Developer', 'Product', 'Version', 'CHPL ID', 'Activity', 'Activity Date', 'Reason', 'Actions'];
    const actualHeaders = await page.getTableHeaders();
    await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    await actualHeaders.forEach(async (header, idx) => expect(await header.getText()).toBe(expectedHeaders[idx]));
  });

  describe('when filtering', () => {
    describe('using predefined filters', () => {
      let countBefore;
      let countAfter;

      beforeEach(async () => {
        countBefore = await page.getTotalResultCount();
      });

      afterEach(async () => {
        await page.resetFilters();
      });

      it('should filter on questionable activity type', async () => {
        await page.setListFilter('triggerIds', '3');
        countAfter = await page.getTotalResultCount();
        await expect(countAfter).toBeLessThan(countBefore);
      });
    });

    describe('by text', () => {
      afterEach(async () => {
        await page.clearSearchTerm();
      });

      it('should show only activities that match the CHPL ID', async () => {
        const searchTerm = '15.99';
        const columnIndex = 3;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });

      it('should show only activities that match the developer', async () => {
        const searchTerm = 'Nextech';
        const columnIndex = 0;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });

      it('should show only activities that match the product', async () => {
        const searchTerm = 'mdTimeline EHR';
        const columnIndex = 1;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });
    });
  });
});
