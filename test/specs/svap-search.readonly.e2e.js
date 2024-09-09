import SvapSearchPage from '../pageobjects/svap-search.page';

const { expect } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

let page;

describe('the SVAP Search page', () => {
  beforeEach(async () => {
    page = new SvapSearchPage();
    await page.open();
  });

  it('should have table headers in a defined order', async () => {
    const expectedHeaders = ['CHPL ID', 'Developer', 'Product', 'Version', 'Status', 'SVAP Information', 'SVAP Notice', 'Actions'];
    const actualHeaders = await page.getTableHeaders();
    await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    await actualHeaders.forEach(async (header, idx) => expect(await header.getText()).toBe(expectedHeaders[idx]));
  });

  it('should not have the Download Listings button for anonymous users', async () => {
    await expect(await page.downloadListingsButton).not.toBeExisting();
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
