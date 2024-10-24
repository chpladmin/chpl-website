import OverviewPage from '../pageobjects/overview.page';

let page;

describe('the Overview page', () => {
  beforeEach(async () => {
    page = new OverviewPage();
    await page.open();
  });

  it('should have an ONC-ACB & ONC-ATL table', async () => {
    await expect(page.acbatlTable).toBeExisting();
  });
});
