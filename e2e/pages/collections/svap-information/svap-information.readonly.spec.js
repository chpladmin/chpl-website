import SvapInformationPage from './svap-information.po';

let page;

describe('the SVAP Information collection page', () => {
  beforeEach(async () => {
    page = new SvapInformationPage();
    await page.open();
  });

  //below text will be updated, once PO confirmed exact text on svap information page
  it('should have body text', async () => {
    await expect(await page.getBodyText()).toContain('This list includes all 2015 Edition, including Cures Update, health IT products that have been INSERT TEXT HERE');
    await expect(await page.getBodyText()).toContain('Please note that by default, only listings that are active or suspended are shown in the search results.');
  });

  it('should have table headers in a defined order', async () => {
    const expectedHeaders = ['CHPL ID', 'Certification Edition', 'Developer', 'Product', 'Version', 'Status', 'SVAP Information', 'SVAP Notice URL', 'Actions'];
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

      it('should filter on Certification Edition', async () => {
        await page.removeFilter('Certification Edition', '2015');
        countAfter = await page.getTotalResultCount();
        await expect(countAfter).toBeLessThan(countBefore);
      });

      it('should filter on Certification Status', async () => {
        await page.removeFilter('Certification Status', 'Active');
        countAfter = await page.getTotalResultCount();
        await expect(countAfter).toBeLessThan(countBefore);
      });

      it('should filter on SVAP value', async () => {
        await page.setListFilter('svapIds', '20');
        countAfter = await page.getTotalResultCount();
        await expect(countAfter).toBeLessThan(countBefore);
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
        const columnIndex = 2;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });

      it('should show only listings that match the product', async () => {
        const searchTerm = 'Soarian Clinicals';
        const columnIndex = 3;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });
    });
  });
});
