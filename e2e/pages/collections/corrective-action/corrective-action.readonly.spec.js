import CorrectiveActionPage from './corrective-action.po';

let page;

describe('the Corrective Action collection page', () => {
  beforeEach(async () => {
    page = new CorrectiveActionPage();
    await page.open();
  });

  it('should have body text', async () => {
    await expect(await page.getBodyText()).toContain('This is a list of all health IT products for which a non-conformity has been recorded. A certified product is non-conforming if, at any time, an ONC-Authorized Certification Body (ONC-ACB) or ONC determines that the product does not comply with a requirement of certification. Non-conformities reported as part of surveillance are noted as "Surveillance NCs", while non-conformities identified though an ONC Direct Review are noted as "Direct Review NCs". Not all non-conformities affect a product\'s functionality, and the existence of a non-conformity does not by itself mean that a product is "defective." Developers of certified products are required to notify customers of non-conformities and must take approved corrective actions to address such non-conformities in a timely and effective manner. Detailed information about non-conformities, and associated corrective action plans, can be accessed below by clicking on the product\'s CHPL ID.');
    await expect(await page.getBodyText()).toContain('Please note that by default, only listings that are active or suspended are shown in the search results.');
  });

  it('should have table headers in a defined order', async () => {
    const expectedHeaders = ['CHPL ID', 'Certification Edition', 'Developer', 'Product', 'Version', 'Status', '# Open Surveillance NCs', '# Closed Surveillance NCs', '# Open Direct Review NCs', '# Closed Direct Review NCs', 'Actions'];
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

      it('should filter on open nonconformities', async () => {
        await page.setListFilter('nonConformityOptions', 'open_nonconformity');
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
        const searchTerm = 'Iatric';
        const columnIndex = 2;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });

      it('should show only listings that match the product', async () => {
        const searchTerm = 'RDEE';
        const columnIndex = 3;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });
    });
  });
});
