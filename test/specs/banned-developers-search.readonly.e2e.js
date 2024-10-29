import BannedDevelopersSearchPage from '../pageobjects/banned-developers-search.page';

let page;

describe('the Banned Developers Search page', () => {
  beforeEach(async () => {
    page = new BannedDevelopersSearchPage();
    await page.open();
  });

  it('should have table headers in a defined order', async () => {
    const expectedHeaders = ['Developer', 'Decertification Date', 'ONC-ACB'];
    const actualHeaders = await page.getTableHeaders();
    await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    await actualHeaders.forEach(async (header, idx) => expect(await header.getText()).toBe(expectedHeaders[idx]));
  });

  it('should be able to Browse', async () => {
    await page.searchForText('e');
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
