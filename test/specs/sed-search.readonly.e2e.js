import SedSearchPage from '../pageobjects/sed-search.page';

const { expect } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

let page;

describe('the SED Search page', () => {
  beforeEach(async () => {
    page = new SedSearchPage();
    await page.open();
  });

  it('should have table headers in a defined order', async () => {
    const expectedHeaders = ['CHPL ID', 'Developer', 'Product', 'Version', 'Status', 'Actions'];
    const actualHeaders = await page.getTableHeaders();
    await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    await actualHeaders.forEach(async (header, idx) => expect(await header.getText()).toBe(expectedHeaders[idx]));
  });

  it('should have the Download Listings button for anonymous users', async () => {
    await expect(await page.downloadListingsButton).toBeExisting();
  });

  it('should be able to Browse', async () => {
    await page.searchForText('s');
    const initialResultCount = await page.getTotalResultCount();
    await page.browse();
    await expect(await page.getTotalResultCount()).not.toBe(initialResultCount);
  });

  it('should be able to search for text', async () => {
    const initialResultCount = await page.getTotalResultCount();
    await page.searchForText('Epic');
    await expect(await page.getTotalResultCount()).toBeLessThan(initialResultCount);
  });
});
