import LoginComponent from '../../../components/login/login.po';
import { open } from '../../../utilities/hooks.async';

import DevelopersPage from './developers.po';

let login;
let page;

beforeEach(async () => {
  page = new DevelopersPage();
  login = new LoginComponent();
  await open('#/resources/overview');
});

describe('the Developers Reports page', () => {
  describe('when logged in as ONC', () => {
    beforeEach(async () => {
      await login.logIn('onc');
      await page.open();
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have title & subtitle', async () => {
      await expect(await page.getTitle()).toContain('CHPL Reports');
      await expect(await page.getSubTitle()).toContain('Developer');
    });

    it('should have table headers in a defined order', async () => {
      const expectedHeaders = ['Developer', 'Developer Code', 'Responsible User', 'Activity Date'];
      const actualHeaders = await page.getTableHeaders();
      await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
      for (const [idx, header] of actualHeaders.entries()) {
        await expect(await header.getText()).toBe(expectedHeaders[idx]);
      }
    });

    it('should have some results', async () => {
      const count = await page.getTotalResultCount();
      expect(count).toBeGreaterThan(page.expectedMinimumCount);
    });

    describe('when filtering', () => {
      describe('by text', () => {
        afterEach(async () => {
          await page.clearSearchTerm();
        });

        it('should only show activities that match the Developer', async () => {
          const searchTerm = 'WRS Health';
          const columnIndex = 0;
          await page.searchForText(searchTerm);
          await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
        });
      });
    });
  });
});
