import DevelopersPage from './developers.po';

let page;

describe('the Developers page', () => {
  beforeEach(async () => {
    page = new DevelopersPage();
    await page.open();
  });

  it('should have body text', async () => {
    await expect(await page.getBodyText()).toContain('Text here?');
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
        const initialCount = await page.getTotalResultCount();
        await page.removeFilter('Has active Listings with ONC-ACB', 'Drummond Group');
        await page.removeFilter('Has any Listings with ONC-ACB', 'Drummond Group');
        const finalCount = await page.getTotalResultCount();
        expect(finalCount).toBeLessThan(initialCount);
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
