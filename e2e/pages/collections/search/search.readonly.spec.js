import SearchPage from './search.po';

let page;

describe('the Search page', () => {
  beforeEach(async () => {
    page = new SearchPage();
    await page.open();
  });

  it('should have body text', async () => {
    await expect(await page.getBodyText()).toContain('Please note that only active and suspended listings are shown by default. Use the Certification Status / Certification Edition filters to display retired, withdrawn, terminated, or 2011 and 2014 edition listings.');
  });

  it('should have table headers in a defined order', async () => {
    const expectedHeaders = ['CHPL ID', 'Certification Edition', 'Developer', 'Product', 'Version', 'Certification Date', 'Status', 'Actions'];
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

      it('should filter on criteria', async () => {
        await page.setListFilter('certificationCriteriaIds', '1');
        countAfter = await page.getTotalResultCount();
        await expect(countAfter).toBeLessThan(countBefore);
      });

      it('should filter on edition', async () => {
        await page.removeFilter('Certification Edition', '2015');
        countAfter = await page.getTotalResultCount();
        await expect(countAfter).toBeLessThan(countBefore);
      });

      it('should filter on status', async () => {
        await page.setListFilter('certificationStatuses', 'Withdrawn_by_Developer');
        countAfter = await page.getTotalResultCount();
        await expect(countAfter).toBeGreaterThan(countBefore);
      });

      it('should filter on cqms', async () => {
        await page.setListFilter('cqms', 'CMS2');
        countAfter = await page.getTotalResultCount();
        await expect(countAfter).toBeLessThan(countBefore);
      });

      it('should filter on compliance', async () => {
        await page.setListFilter('hasHadComplianceActivity', 'true');
        countAfter = await page.getTotalResultCount();
        await expect(countAfter).toBeLessThan(countBefore);
      });

      it('should filter on non-conformities', async () => {
        await page.setListFilter('nonConformityOptions', 'open_nonconformity');
        countAfter = await page.getTotalResultCount();
        await expect(countAfter).toBeLessThan(countBefore);
      });

      it('should filter on ONC-ACB', async () => {
        await page.removeFilter('ONC-ACB', 'Drummond Group');
        countAfter = await page.getTotalResultCount();
        await expect(countAfter).toBeLessThan(countBefore);
      });
    });

    describe('by text', () => {
      afterEach(async () => {
        await page.clearSearchTerm();
      });

      it('should show only listings that match the CHPL ID', async () => {
        const searchTerm = '15.99';
        const columnIndex = 0;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });

      it('should show only listings that match the developer', async () => {
        const searchTerm = 'Nextech';
        const columnIndex = 2;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });

      it('should show only listings that match the product', async () => {
        const searchTerm = 'Haystack';
        const columnIndex = 3;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });
    });
  });
});
