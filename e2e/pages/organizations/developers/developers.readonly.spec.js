import DevelopersPage from './developers.po';

let page;

describe('the Developers page', () => {
  beforeEach(async () => {
    page = new DevelopersPage();
    await page.open();
  });

  it('should have table headers in a defined order', async () => {
    const expectedHeaders = ['Developer', 'Developer Code', 'ONC-ACB for active Listings'];
    const actualHeaders = await page.getTableHeaders();
    await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    await actualHeaders.forEach(async (header, idx) => expect(await header.getText()).toBe(expectedHeaders[idx]));
  });

  describe('when filtering', () => {
    describe('using predefined filters', () => {
      afterEach(async () => {
        await page.resetFilters();
      });

      it('should filter results on Active Listings', async () => {
        const initialCount = await page.getTotalResultCount();
        await page.removeFilter('Active Listings', 'Has Any Active');
        const finalCount = await page.getTotalResultCount();
        expect(finalCount).toBeGreaterThan(initialCount);
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
        const searchTerm = '3071';
        await page.searchForText(searchTerm);
        const finalCount = await page.getTotalResultCount();
        expect(finalCount).toBe(1);
      });
    });
  });
});
