import SvapInformationPage from './svap-information.po';

let page;

describe('the SVAP Information collection page', () => {
  beforeEach(async () => {
    page = new SvapInformationPage();
    await page.open();
  });

  it('should have body text', async () => {
    await expect(await page.getBodyText()).toContain('This collection features Health IT Module(s) that have successfully adopted advanced interoperability standards through the');
    await expect(await page.getBodyText()).toContain('Health IT developers participating in the ONC Health IT Certification Program are encouraged to incorporate the most up-to-date standards in their Health IT Module(s), as outlined in §170.405(a)');
  });

  it('should have table headers in a defined order', async () => {
    const expectedHeaders = ['CHPL ID', 'Developer', 'Product', 'Version', 'Status', 'SVAP Information', 'SVAP Notice', 'Actions'];
    const actualHeaders = await page.getTableHeaders();
    await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    await actualHeaders.forEach(async (header, idx) => expect(await header.getText()).toBe(expectedHeaders[idx]));
  });

  it('should have SVAP Summary link', async () => {
    await expect(await (await page.getDownloadSvapDocumentation()).isDisplayed()).toBe(true);
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

      it('should filter on ONC-ACB', async () => {
        await page.removeFilter('ONC-ACB', 'SLI Compliance');
        countAfter = await page.getTotalResultCount();
        await expect(countAfter).toBeLessThan(countBefore);
      });
    });

    describe('by text', () => {
      afterEach(async () => {
        await page.clearSearchTerm();
      });

      it('should show only listings that match the CHPL ID', async () => {
        const searchTerm = '15.04.04';
        const columnIndex = 0;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });

      it('should show only listings that match the developer', async () => {
        const searchTerm = 'AssureCare LLC';
        const columnIndex = 1;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });

      it('should show only listings that match the product', async () => {
        const searchTerm = 'Soarian Clinicals';
        const columnIndex = 2;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });
    });
  });
});
