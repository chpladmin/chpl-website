import { open } from '../../../utilities/hooks.async';

import BannedDevelopersPage from './banned-developers.po';

let page;

describe('the Developers Under Certification Ban collection page', () => {
  beforeEach(async () => {
    page = new BannedDevelopersPage();
    await open('#/collections/developers');
    await (browser.waitUntil(async () => !page.isLoading()));
  });

  it('should have body text', async () => {
    await expect(await page.getBodyText().getText()).toContain('This is a list of health IT developers currently precluded from certifying any health IT products under the ONC Health IT Certification Program - including new products as well as upgraded versions of current products. ONC may lift these statuses if it determines that the developer has taken appropriate steps to remedy problems or issues for all affected products and users and prevent their recurrence. A developer may be precluded from certifying products for two reasons:');
    await expect(await page.getBodyText().getText()).toContain('A developer may be precluded from the Program if the developer or one of its products fails to comply with any requirements of certification and the developer fails to take appropriate actions to correct the non-compliance.');
    await expect(await page.getBodyText().getText()).toContain('A developer may also be precluded if it fails to cooperate with the surveillance or other oversight of its certified products. ONC may lift the ban if it determines that the developer has taken appropriate steps to remedy problems or issues for all affected products and users and prevent their recurrence.');
  });

  it('should have table headers in a defined order', async () => {
    const expectedHeaders = ['Developer\nsorted ascending', 'Decertification Date', 'ONC-ACB'];
    const actualHeaders = await page.getTableHeaders();
    await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    for (const [idx, header] of actualHeaders.entries()) {
      await expect(await header.getText()).toBe(expectedHeaders[idx]);
    };
  });

  describe('when filtering', () => {
    describe('using predefined filters', () => {
      let countBefore;
      let countAfter;
      beforeEach(async () => {
        countBefore = await page.getListingTotalCount();
      });

      afterEach(async () => {
        await page.resetFilters();
      });

      describe('when removing "Drummond"', () => {
        it('should filter listing results', async () => {
          await page.removeFilter('ONC-ACB', 'Drummond Group');
          await expect(await page.hasNoResults()).toBe(true);
        });
      });

      xdescribe('using date filter', () => {
        it('should filter listing results', async () => {
          await page.dateFilter.click();
          await page.fromDate.setValue('09/01/2017')
          await page.toDate.setValue('10/01/2019');
          await page.waitForUpdatedListingResultsCount();
          countAfter = await page.getListingTotalCount();
          await expect(countAfter).toBeLessThan(countBefore);
        });
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

      it('should search by developer code', async () => {
        const searchTerm = '2943';
        const developerName = 'SocialCare by Health Symmetric, Inc.';
        const columnIndex = 0;
        await page.searchForText(searchTerm);
        await expect(await page.getTableCellText(page.getResults()[0], columnIndex)).toContain(developerName);
      });
    });
  });
});
