import DeveloperSearchPage from '../pageobjects/developer-search.page';

const { browser, expect } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

let page;

describe('the Developer Search page', () => {
  /*
  beforeEach(async () => {
    await DeveloperSearchPage.open();
    await (browser.waitUntil(async () => !(await DeveloperSearchPage.isLoading())));
  });
*/
  it('should have table headers in a defined order', async () => {
    page = new DeveloperSearchPage();
    console.log('--------------------------------------------------------------------------------');
    console.log(page.name);
    console.log(page.elements);
    console.log('--------------------------------------------------------------------------------');
    await page.open();
    await (browser.waitUntil(async () => !(await page.isLoading())));
    const expectedHeaders = ['Developer', 'Developer Code', 'ONC-ACB for active Listings'];
    const actualHeaders = await page.getTableHeaders();
    await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    await actualHeaders.forEach(async (header, idx) => expect(await header.getText()).toBe(expectedHeaders[idx]));
  });
});
