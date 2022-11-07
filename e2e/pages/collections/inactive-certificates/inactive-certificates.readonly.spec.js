import InactiveCertificatesPage from './inactive-certificates.po';

let page;

describe('the Inactive Certificates collection page', () => {
  beforeEach(async () => {
    page = new InactiveCertificatesPage();
    await page.open();
  });

  it('should have body text', async () => {
    await expect(await page.getBodyText()).toContain('This list includes all health IT products that have had their status changed to an "inactive" status on the Certified Health IT Products List (CHPL). This may be simply because the developer no longer supports the product or for other reasons that are not in response to ONC-ACB surveillance, ONC direct review, or a finding of non-conformity. For further descriptions of the certification statuses, please consult the CHPL Public User Guide. For more information on how an inactive certificate may affect your attestation to the CMS EHR Incentive Programs, please consult the CMS FAQ. For additional information about how an inactive certificate may affect your participation in other CMS programs, please reach out to that program.');
    await expect(await page.getBodyText()).toContain('Note: This list excludes 2011 and 2014 edition certificates. The 2011 and 2014 editions have been retired from the certification program.');
  });

  it('should have table headers in a defined order', async () => {
    const expectedHeaders = ['CHPL ID', 'Certification Edition', 'Developer', 'Product', 'Version', 'Certification Status', 'Decertification Date'];
    const actualHeaders = await page.getTableHeaders();
    await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    for (const [idx, header] of actualHeaders.entries()) {
      await expect(await header.getText()).toBe(expectedHeaders[idx]);
    }
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
        await page.setListFilter('certificationStatuses', 'Active');
        countAfter = await page.getTotalResultCount();
        await expect(countAfter).toBeGreaterThan(countBefore);
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
