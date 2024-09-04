import ApiDocumentationSearchPage from '../pageobjects/api-documentation-search.page';

const { expect } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

let page;

describe('the Api Documentation Search page', () => {
  beforeEach(async () => {
    page = new ApiDocumentationSearchPage();
    await page.open();
  });

  it('should have table headers in a defined order', async () => {
    const expectedHeaders = ['CHPL ID', 'Developer', 'Product', 'Version', 'Status', 'API Documentation', 'Service Base URL List', 'Mandatory Disclosures URL', 'Actions'];
    const actualHeaders = await page.getTableHeaders();
    await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    await actualHeaders.forEach(async (header, idx) => expect(await header.getText()).toBe(expectedHeaders[idx]));
  });

  it('should have the Download Listings button for anonymous users', async () => {
    await expect(await page.downloadListingsButton).toBeExisting();
  });

  it('should be able to Browse', async () => {
    await page.searchForText('e');
    const initialResultCount = await page.getTotalResultCount();
    await page.browse();
    await expect(await page.getTotalResultCount()).not.toBe(initialResultCount);
  });
});
