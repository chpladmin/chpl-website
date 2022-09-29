import LoginComponent from '../../../components/login/login.po';
import { open } from '../../../utilities/hooks.async';

import ChangeRequestsPage from './change-requests.po';

let login;
let page;

beforeEach(async () => {
  page = new ChangeRequestsPage();
  login = new LoginComponent();
  await open('#/resources/overview');
});

describe('the Change Requests page', () => {
  describe('when logged in as ONC', () => {
    beforeEach(async () => {
      await login.logIn('onc');
      await page.open();
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have table headers in a defined order', async () => {
      const expectedHeaders = ['Developer', 'Request Type', 'Creation Date', 'Request Status', 'Time Since Last Status Change', 'Associated ONC-ACBs', 'Actions'];
      const actualHeaders = await page.getTableHeaders();
      await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
      for (const [idx, header] of actualHeaders.entries()) {
        await expect(await header.getText()).toBe(expectedHeaders[idx]);
      }
    });

    it('should find a specific Rejected Change Request', async () => {
      const searchTerm = 'radio';
      const developerColumn = 0;
      const creationColumn = 2;
      const developerName = 'Radiologex';
      const creationTime = 'May 13, 2022 11:34:45 AM';
      await page.setListFilter('currentStatusNames', 'Rejected');
      await page.removeFilter('Change Request Status', 'Pending Developer Action');
      await page.searchForText(searchTerm);
      await expect(await page.getCellInRow(0, developerColumn)).toContain(developerName);
      await expect(await page.getCellInRow(0, creationColumn)).toContain(creationTime);
    });
  });
});
