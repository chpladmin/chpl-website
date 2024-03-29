import DecertifiedProductsPage from './decertified-products.po';

let page;

describe('the Decertified Products collection page', () => {
  beforeEach(async () => {
    page = new DecertifiedProductsPage();
    await page.open();
  });

  it('should have body text', async () => {
    await expect(await page.getBodyText()).toContain('This list includes all health IT products that have had their status changed to a "decertified" status on the Certified Health IT Products List (CHPL). A product may be decertified for the following reasons: certificate terminated by ONC, certificate withdrawn by an ONC-ACB, or certification withdrawn by an ONC-ACB because the health IT developer requested it to be withdrawn when the product was under ONC-ACB surveillance or ONC direct review. For further descriptions of the certification statuses, please consult the CHPL Public User Guide. For more information on how a decertified product may affect your attestation to the CMS EHR Incentive Programs, please consult the CMS FAQ. For additional information about how a decertified product may affect your participation in other CMS programs, please reach out to that program.');
  });

  it('should have table headers in a defined order', async () => {
    const expectedHeaders = ['CHPL ID', 'Developer', 'Product', 'Version', 'Status', 'Decertification Date', 'Actions'];
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

      it('should filter on Certification Status', async () => {
        await page.removeFilter('Certification Status', 'Withdrawn by ONC-ACB');
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
        const searchTerm = 'Celerity';
        const columnIndex = 1;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });

      it('should show only listings that match the product', async () => {
        const searchTerm = 'Haystack';
        const columnIndex = 2;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });
    });
  });
});
