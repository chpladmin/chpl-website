import LoginComponent from '../../../components/login/login.po';

import ChangeRequestsPage from './change-requests.po';

let login;
let page;

beforeAll(async () => {
  page = new ChangeRequestsPage();
  login = new LoginComponent();
  await page.open();
});

describe('the Change Requests page', () => {
  describe('when logged in as ONC', () => {
    beforeAll(async () => {
      await login.logIn('onc');
    });

    it('should find a specific Rejected Change Request', async () => {
      const searchTerm = 'Universal EHR';
      const developerColumn = 0;
      const creationColumn = 2;
      const developerName = 'Universal EHR, Inc.';
      const creationTime = 'Apr 20, 2022 1:28:20 PM';
      await page.clearFilter('Change Request Status', 'Pending Developer Action');
      await page.clearFilter('Change Request Status', 'Pending ONC-ACB Action');
      await page.setListFilter('currentStatusNames', 'Rejected');
      await page.searchForText(searchTerm);
      expect(await page.getCellInRow(0, developerColumn)).toContain(developerName);
      expect(await page.getCellInRow(0, creationColumn)).toContain(creationTime);
    });

    it('should have table headers in a defined order', async () => {
      const expectedHeaders = ['Developer', 'Request Type', 'Creation Date', 'Request Status', 'Time Since Last Status Change', 'Associated ONC-ACBs', 'Actions'];
      const actualHeaders = await page.getTableHeaders();
      expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
      for (const [idx, header] of actualHeaders.entries()) {
        expect(await header.getText()).toBe(expectedHeaders[idx]);
      }
    });
  });
});
