import ListingSearchPage from '../pageobjects/listing-search.page';

const { expect } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

let page;

describe('the Listing Search page', () => {
  beforeEach(async () => {
    page = new ListingSearchPage();
    await page.open();
  });

  it('should have table headers in a defined order', async () => {
    const expectedHeaders = ['Developer', 'Developer Code', 'ONC-ACB for active Listings'];
    const actualHeaders = await page.getTableHeaders();
    await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    await actualHeaders.forEach(async (header, idx) => expect(await header.getText()).toBe(expectedHeaders[idx]));
  });

  it('should have the Download Listings button for anonymous users', async () => {
    await expect(await page.downloadListingsButton).toBeExisting();
  });
});
