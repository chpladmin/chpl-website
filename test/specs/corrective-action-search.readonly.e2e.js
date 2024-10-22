import CorrectiveActionSearchPage from '../pageobjects/corrective-action-search.page';

let page;

describe('the Corrective Action Search page', () => {
  beforeEach(async () => {
    page = new CorrectiveActionSearchPage();
    await page.open();
  });

  it('should have table headers in a defined order', async () => {
    const expectedHeaders = ['CHPL ID', 'Developer', 'Product', 'Version', 'Status', '# Open Surveillance NCs', '# Closed Surveillance NCs', '# Open Direct Review NCs', '# Closed Direct Review NCs', 'Actions'];
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

  it('should be able to search for text', async () => {
    const initialResultCount = await page.getTotalResultCount();
    await page.searchForText('Epic');
    await expect(await page.getTotalResultCount()).toBeLessThan(initialResultCount);
  });
});
