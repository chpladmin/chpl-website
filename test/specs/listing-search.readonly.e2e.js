import ListingSearchPage from '../pageobjects/listing-search.page';

let page;

describe('the Listing Search page', () => {
  beforeEach(async () => {
    page = new ListingSearchPage();
    await page.open();
  });

  describe('when on the results screen', () => {
    beforeEach(async () => {
      await page.browse();
    });

    it('should have the Download Listings button for anonymous users', async () => {
      await expect(await page.downloadListingsButton).toBeExisting();
    });

    it('should be able to Browse after searching for text', async () => {
      await page.searchForText('e');
      const searchedForTextResultCount = await page.getTotalResultCount();
      await page.browse();
      await expect(await page.getTotalResultCount()).toBeGreaterThan(searchedForTextResultCount);
    });

    it('should be able to search for text', async () => {
      const initialResultCount = await page.getTotalResultCount();
      await page.searchForText('Epic');
      await expect(await page.getTotalResultCount()).toBeLessThan(initialResultCount);
    });
  });
});
