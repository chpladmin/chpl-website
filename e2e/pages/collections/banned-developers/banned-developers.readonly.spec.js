import { open } from '../../../utilities/hooks.async';

import BannedDevelopersPage from './banned-developers.po';

let page;

describe('the Developers Under Certification Ban collection page', () => {
  beforeEach(async () => {
    page = new BannedDevelopersPage();
    await open('#/collections/developers');
    await (browser.waitUntil(async () => !(await page.isLoading())));
  });

  it('should have body text', async () => {
    await expect(await page.getBodyText()).toContain('This is a list of health IT developers currently precluded from certifying any health IT products under the ONC Health IT Certification Program - including new products as well as upgraded versions of current products. ONC may lift these statuses if it determines that the developer has taken appropriate steps to remedy problems or issues for all affected products and users and prevent their recurrence. A developer may be precluded from certifying products for two reasons:');
    await expect(await page.getBodyText()).toContain('A developer may be precluded from the Program if the developer or one of its products fails to comply with any requirements of certification and the developer fails to take appropriate actions to correct the non-compliance.');
    await expect(await page.getBodyText()).toContain('A developer may also be precluded if it fails to cooperate with the surveillance or other oversight of its certified products. ONC may lift the ban if it determines that the developer has taken appropriate steps to remedy problems or issues for all affected products and users and prevent their recurrence.');
  });

  it('should have table headers in a defined order', async () => {
    const expectedHeaders = ['Developer', 'Decertification Date', 'ONC-ACB'];
    const actualHeaders = await page.getTableHeaders();
    await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    await actualHeaders.forEach(async (header, idx) => expect(await header.getText()).toBe(expectedHeaders[idx]));
  });

  describe('when filtering', () => {
    describe('using predefined filters', () => {
      afterEach(async () => {
        await page.resetFilters();
      });

      it('should filter results on ONC-ACBs', async () => {
        await page.removeFilter('ONC-ACB', 'Drummond Group');
        await expect(await page.hasNoResults()).toBe(true);
      });

      // ignored because filling out the date field doesn't seem possible
      xit('should filter results on decertification date', async () => {
        await page.setDateFilter('decertificationDate', false, ['2', 'Oct', 'Tab', '2020']);
        await expect(await page.hasNoResults()).toBe(true);
      });
    });

    describe('by text', () => {
      afterEach(async () => {
        await page.clearSearchTerm();
      });

      it('should search by developer name', async () => {
        const searchTerm = 'Rabbit';
        await page.searchForText(searchTerm);
        await expect(await page.hasNoResults()).toBe(true);
      });

      // ignored because I can't figure out how to search for the thing that's already on the page, without clearing it and searching again, and searching for something else, then changing the search term to the right value seems to just append the right value to the wrong one
      xit('should search by developer code', async () => {
        const searchTerm = '2943';
        const developerName = 'SocialCare by Health Symmetric, Inc.';
        const columnIndex = 0;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow([await page.getResults()], columnIndex)).toContain(developerName);
      });
    });
  });
});
